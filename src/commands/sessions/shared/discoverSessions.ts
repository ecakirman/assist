import { discoverHistoryEntries } from "./discoverHistoryEntries";
import { discoverSessionJsonlPaths } from "./discoverSessionJsonlPaths";
import type { HistoricalSession } from "./parseSessionFile";

export async function discoverSessionFiles(): Promise<string[]> {
	return (await discoverSessionJsonlPaths()).map((p) => p.path);
}

export async function discoverSessions(): Promise<HistoricalSession[]> {
	return (await discoverHistoryEntries()).map((entry) => entry.session);
}
