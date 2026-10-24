import { highLevelDraftPath } from "./highLevelDraftPath";
import type { HighLevelReviewDraft } from "./types";
import { writeJsonFile } from "./writeJsonFile";

export function saveHighLevelDraft(draft: HighLevelReviewDraft): string {
	return writeJsonFile(
		highLevelDraftPath(draft.repo, draft.headRef, draft.headSha),
		draft,
	);
}
