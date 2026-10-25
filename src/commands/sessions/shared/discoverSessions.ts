import { discoverHistoryEntries } from "./discoverHistoryEntries";
import type { HistoricalSession } from "./parseSessionFile";

export async function discoverSessions(): Promise<HistoricalSession[]> {
	return (await discoverHistoryEntries()).map((entry) => entry.session);
}
