import type {
	PreviewChecklistItem,
	PreviewReviewComment,
} from "../../../../../../../shared/PreviewDecision";
import type { PrDecisionDetails } from "../../../../../PrDecisionDetails";

export function highLevelDecisionDetails(
	checklist: PreviewChecklistItem[],
	reviewComments: PreviewReviewComment[],
): PrDecisionDetails {
	return {
		comments: [],
		screenshots: [],
		reviewAfter: false,
		announceAfter: false,
		draft: false,
		autoMerge: false,
		checklist,
		reviewComments,
	};
}
