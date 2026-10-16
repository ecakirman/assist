import type { SessionInfo } from "../../../../../types";

export function hasPendingHighLevelReview(
	session: SessionInfo,
	prNumber: number,
): boolean {
	const preview = session.pendingPrPreview;
	return preview?.kind === "high-level-review" && preview.prNumber === prNumber;
}
