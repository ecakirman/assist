import type { SessionInfo } from "../../../../../types";
import { isHighLevelReviewSession } from "./hasPendingHighLevelReview/isHighLevelReviewSession";

export function hasPendingHighLevelReview(
	session: SessionInfo,
	prNumber: number,
): boolean {
	const preview = session.pendingPrPreview;
	return (
		isHighLevelReviewSession(session, prNumber) &&
		preview?.kind === "high-level-review" &&
		preview.prNumber === prNumber
	);
}
