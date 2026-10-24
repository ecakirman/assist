import { pasteAndSubmit } from "../shared/pasteAndSubmit";
import { daemonLog } from "./daemonLog";
import type { Session } from "./types";

export function typePromptIntoSession(
	sessions: Map<string, Session>,
	id: string,
	text: string,
	write: (id: string, data: string) => void,
): string | undefined {
	const session = sessions.get(id);
	if (!session) return `assist session ${id} was not found`;
	if (session.status === "done" || !session.pty)
		return `assist session ${id} has ended`;
	pasteAndSubmit(write, id, text);
	daemonLog(`session ${id} typed prompt (${text.length} chars)`);
	return undefined;
}
