import type { HistoryEntry } from "../../shared/HistoryEntry";
import type { HistorySnippet } from "../../shared/HistorySnippet";
import type { HistoricalSession } from "../../shared/parseSessionFile";
import { repoGroupForCwd } from "../repoGroupForCwd";
import { withRepoGroups } from "../withRepoGroups";
import { findTranscriptMatch } from "./findTranscriptMatch";
import { discoverHistoryEntries } from "../../shared/discoverHistoryEntries";

const BATCH_SIZE = 16;
const MAX_RESULTS = 100;

type HistorySearchHit = HistoricalSession & { snippet: HistorySnippet };

function inRepo(cwd: string): (entry: HistoryEntry) => boolean {
	const selectedKey = repoGroupForCwd(cwd)?.origin || cwd;
	return ({ session }) => {
		const group = repoGroupForCwd(session.cwd);
		const key = group?.origin || session.cwd;
		return key === selectedKey || (group?.clone || session.cwd) === cwd;
	};
}

async function matchBatch(
	batch: HistoryEntry[],
	query: string,
): Promise<HistorySearchHit[]> {
	const matches = await Promise.all(
		batch.map(async ({ session, filePath }) => {
			const snippet = await findTranscriptMatch(
				filePath,
				session.harness,
				query,
			);
			return snippet ? { ...session, snippet } : null;
		}),
	);
	return matches.filter((hit) => hit !== null);
}

export async function searchHistory(
	cwd: string,
	query: string,
): Promise<HistorySearchHit[]> {
	const candidates = (await discoverHistoryEntries()).filter(inRepo(cwd));
	const hits: HistorySearchHit[] = [];
	for (
		let i = 0;
		i < candidates.length && hits.length < MAX_RESULTS;
		i += BATCH_SIZE
	)
		hits.push(
			...(await matchBatch(candidates.slice(i, i + BATCH_SIZE), query)),
		);
	return withRepoGroups(hits.slice(0, MAX_RESULTS));
}
