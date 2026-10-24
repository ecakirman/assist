import type { PreviewDecision } from "../../sessions/shared/PreviewDecision";
import type {
	HighLevelCheckResult,
	HighLevelReviewItem,
	HighLevelReviewProgress,
} from "./types";

function toItem(
	check: HighLevelCheckResult,
	decision: PreviewDecision,
): HighLevelReviewItem {
	const ticked = decision.checklist?.find((entry) => entry.id === check.id);
	const comment = ticked?.comment?.trim();
	return {
		id: check.id,
		kind: check.kind,
		title: check.title,
		status: check.status,
		reason: check.reason,
		ticked: ticked?.ticked ?? check.status === "pass",
		...(comment ? { comment } : {}),
	};
}

export function highLevelProgress(
	checks: HighLevelCheckResult[],
	decision: PreviewDecision,
): HighLevelReviewProgress {
	const reviewComments = decision.reviewComments ?? [];
	return {
		items: checks.map((check) => toItem(check, decision)),
		...(reviewComments.length > 0 ? { reviewComments } : {}),
	};
}
