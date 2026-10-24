import { highLevelReviewPath } from "./highLevelReviewPath";
import type { HighLevelReviewRecord } from "./types";
import { writeJsonFile } from "./writeJsonFile";

export function saveHighLevelReview(record: HighLevelReviewRecord): string {
	return writeJsonFile(
		highLevelReviewPath(record.repo, record.headRef, record.headSha),
		record,
	);
}
