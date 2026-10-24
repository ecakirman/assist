import { highLevelReviewPath } from "./highLevelReviewPath";

export function highLevelDraftPath(
	repo: string,
	headRef: string,
	headSha: string,
): string {
	return highLevelReviewPath(repo, headRef, headSha).replace(
		/\.json$/,
		".draft.json",
	);
}
