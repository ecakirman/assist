import { loadHighLevelDraft } from "./loadHighLevelDraft";
import { loadHighLevelReview } from "./loadHighLevelReview";
import type { HighLevelPreviewPayload } from "./types";

export function loadReopenedReview(
	repo: string,
	headRef: string,
	headSha: string,
): Pick<HighLevelPreviewPayload, "saved" | "draft"> {
	const saved = loadHighLevelReview(repo, headRef, headSha);
	const draft = loadHighLevelDraft(repo, headRef, headSha);
	return {
		...(saved ? { saved } : {}),
		...(draft ? { draft } : {}),
	};
}
