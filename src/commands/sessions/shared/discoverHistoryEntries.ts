import { discoverCodexHistoryEntries } from "./codex/discoverCodexHistoryEntries";
import type { HistoryEntry } from "./HistoryEntry";
import { parseSessionFile } from "./parseSessionFile";
import { discoverSessionJsonlPaths } from "./discoverSessionJsonlPaths";

export async function discoverHistoryEntries(): Promise<HistoryEntry[]> {
	const paths = await discoverSessionJsonlPaths();
	const entries: HistoryEntry[] = [];

	await Promise.all(
		paths.map(async ({ path: filePath, origin }) => {
			const session = await parseSessionFile(filePath, origin);
			if (session) entries.push({ session, filePath });
		}),
	);
	entries.push(...(await discoverCodexHistoryEntries()));

	entries.sort(
		(a, b) =>
			new Date(b.session.timestamp).getTime() -
			new Date(a.session.timestamp).getTime(),
	);
	return entries;
}
