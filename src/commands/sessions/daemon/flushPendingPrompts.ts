import { pasteAndSubmit } from "../shared/pasteAndSubmit";
import { daemonLog } from "./daemonLog";
import type { Session } from "./types";

export function flushPendingPrompts(
	session: Session | undefined,
	write: (id: string, data: string) => void,
): void {
	if (!session?.pendingPrompts?.length || session.permissionActive) return;
	if (session.status === "done" || !session.pty) return;
	const text = session.pendingPrompts.join("\n\n");
	daemonLog(
		`session ${session.id} typed ${session.pendingPrompts.length} queued prompt(s)`,
	);
	session.pendingPrompts = undefined;
	pasteAndSubmit(write, session.id, text);
}
