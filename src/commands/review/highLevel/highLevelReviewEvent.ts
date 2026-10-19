import type {
	PreviewDecision,
	PreviewReviewEvent,
} from "../../sessions/shared/PreviewDecision";

export function highLevelReviewEvent(
	decision: PreviewDecision,
): PreviewReviewEvent {
	if (decision.reviewEvent) return decision.reviewEvent;
	return decision.decision === "approve" ? "APPROVE" : "REQUEST_CHANGES";
}
