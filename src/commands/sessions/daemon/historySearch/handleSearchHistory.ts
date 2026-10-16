import { type SessionClient, sendTo } from "../broadcast";
import { daemonLog } from "../daemonLog";
import { searchHistory } from "./searchHistory";

export async function handleSearchHistory(
	client: SessionClient,
	data: Record<string, unknown>,
): Promise<void> {
	const cwd = typeof data.cwd === "string" ? data.cwd : "";
	const query = typeof data.query === "string" ? data.query.trim() : "";
	const started = Date.now();
	try {
		const sessions = cwd && query ? await searchHistory(cwd, query) : [];
		daemonLog(
			`history search cwd=${cwd} chars=${query.length}: ${sessions.length} match(es) in ${Date.now() - started}ms`,
		);
		sendTo(client, { type: "history-search", sessions });
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		daemonLog(`history search cwd=${cwd} failed: ${message}`);
		sendTo(client, { type: "history-search", error: message });
	}
}
