import { useState } from "react";
import type { HighLevelReviewProgress } from "../../../../../../../../review/highLevel/types";
import type { PreviewReviewComment } from "../../../../../../../shared/PreviewDecision";

export function useHighLevelReviewQueue(saved?: HighLevelReviewProgress) {
	const [queued, setQueued] = useState<PreviewReviewComment[]>(
		() => saved?.reviewComments ?? [],
	);
	return {
		queued,
		onQueue: (comment: PreviewReviewComment) =>
			setQueued((current) => [...current, comment]),
		onRemove: (index: number) =>
			setQueued((current) => current.filter((_, i) => i !== index)),
	};
}
