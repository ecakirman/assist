import { pasteAndSubmit } from "../shared/pasteAndSubmit";
import { daemonLog } from "./daemonLog";
import type { Session } from "./types";

export type TypePromptResult = { refused: string } | { queued: boolean };

export function typePromptIntoSession(
	sessions: Map<string, Session>,
	id: string,
	text: string,
	write: (id: string, data: string) => void,
): TypePromptResult {
	const session = sessions.get(id);
	if (!session) return { refused: `assist session ${id} was not found` };
	if (session.status === "done" || !session.pty)
		return { refused: `assist session ${id} has ended` };
	if (session.permissionActive) {
		session.pendingPrompts = [...(session.pendingPrompts ?? []), text];
		daemonLog(
			`session ${id} queued prompt behind open permission prompt: ${JSON.stringify(text)}`,
		);
		return { queued: true };
	}
	pasteAndSubmit(write, id, text);
	daemonLog(`session ${id} typed prompt: ${JSON.stringify(text)}`);
	return { queued: false };
}
