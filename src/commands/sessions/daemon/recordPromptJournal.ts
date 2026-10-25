import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { daemonPaths } from "./daemonPaths";

type PromptJournalEntry = {
	event: "received" | "outcome" | "undelivered";
	sessionId?: string;
	text?: string;
	message?: string;
};

export function recordPromptJournal(entry: PromptJournalEntry): void {
	const line = JSON.stringify({ at: new Date().toISOString(), ...entry });
	try {
		mkdirSync(dirname(daemonPaths.promptJournal), { recursive: true });
		appendFileSync(daemonPaths.promptJournal, `${line}\n`);
	} catch {}
}
