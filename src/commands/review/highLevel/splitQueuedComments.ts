import { fetchHighLevelFiles } from "./fetchHighLevelFiles";
import {
	type SplitReviewComments,
	splitHighLevelReviewComments,
} from "./splitHighLevelReviewComments";
import type { HighLevelReviewRecord } from "./types";

export function splitQueuedComments(
	record: HighLevelReviewRecord,
): SplitReviewComments {
	const queued = record.reviewComments ?? [];
	if (queued.length === 0) return { lineLevel: [], remainder: [] };
	try {
		const files = fetchHighLevelFiles(record.prNumber, record.repo);
		return splitHighLevelReviewComments(queued, files);
	} catch (error) {
		console.error(
			`Could not read the PR diff, so every comment goes in the PR-level body: ${(error as Error).message}`,
		);
		return { lineLevel: [], remainder: queued };
	}
}
