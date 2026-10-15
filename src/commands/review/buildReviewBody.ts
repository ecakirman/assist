import { appendCiFooter } from "./appendCiFooter";
import { buildReviewSummary } from "./buildReviewSummary";
import type { UnanchoredFinding } from "./partitionFindings";
import { sanitiseReviewerNames } from "./sanitiseReviewerNames";

export function buildReviewBody(
	markdown: string,
	unanchored: UnanchoredFinding[],
	ciFooter?: string,
): string {
	return appendCiFooter(
		sanitiseReviewerNames(buildReviewSummary(markdown, unanchored)),
		ciFooter,
	);
}
