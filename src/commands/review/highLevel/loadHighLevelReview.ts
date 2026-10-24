import { highLevelReviewPath } from "./highLevelReviewPath";
import { readJsonFile } from "./readJsonFile";
import type { HighLevelReviewRecord } from "./types";

export function loadHighLevelReview(
	repo: string,
	headRef: string,
	headSha: string,
): HighLevelReviewRecord | undefined {
	return readJsonFile(highLevelReviewPath(repo, headRef, headSha));
}
