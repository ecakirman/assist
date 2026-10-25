import { pasteAndSubmit } from "../shared/pasteAndSubmit";
import { daemonLog } from "./daemonLog";
import type { Session } from "./types";

export function flushPendingPrompts(
	session: Session | undefined,
	write: (id: string, data: string) => void,
): boolean {
	if (!session?.pendingPrompts?.length || session.permissionActive)
		return false;
	if (session.status === "done" || !session.pty) return false;
	const text = session.pendingPrompts.join("\n\n");
	daemonLog(
		`session ${session.id} typed ${session.pendingPrompts.length} queued prompt(s)`,
	);
	session.pendingPrompts = undefined;
	pasteAndSubmit(write, session.id, text);
	return true;
}
