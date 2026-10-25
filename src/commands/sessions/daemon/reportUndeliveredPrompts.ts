import { daemonLog } from "./daemonLog";
import { recordPromptJournal } from "./recordPromptJournal";
import type { Session } from "./types";

export function reportUndeliveredPrompts(session: Session, why: string): void {
	const pending = session.pendingPrompts;
	if (!pending?.length) return;
	session.pendingPrompts = undefined;
	for (const text of pending) {
		daemonLog(
			`session ${session.id} ${why}; queued prompt undelivered: ${JSON.stringify(text)}`,
		);
		recordPromptJournal({
			event: "undelivered",
			sessionId: session.id,
			text,
			message: why,
		});
	}
}
