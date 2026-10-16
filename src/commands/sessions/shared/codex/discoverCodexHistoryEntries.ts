import type { HistoryEntry } from "../HistoryEntry";
import { discoverCodexRolloutPaths } from "./discoverCodexRolloutPaths";
import { parseCodexSessionFile } from "./parseCodexSessionFile";

export async function discoverCodexHistoryEntries(): Promise<HistoryEntry[]> {
	const paths = await discoverCodexRolloutPaths();
	const parsed = await Promise.all(
		paths.map(async (filePath) => {
			const session = await parseCodexSessionFile(filePath);
			return session ? { session, filePath } : null;
		}),
	);
	return parsed.filter((entry) => entry !== null);
}
