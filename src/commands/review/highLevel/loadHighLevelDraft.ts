import { highLevelDraftPath } from "./highLevelDraftPath";
import { readJsonFile } from "./readJsonFile";
import type { HighLevelReviewDraft } from "./types";

export function loadHighLevelDraft(
	repo: string,
	headRef: string,
	headSha: string,
): HighLevelReviewDraft | undefined {
	return readJsonFile(highLevelDraftPath(repo, headRef, headSha));
}
