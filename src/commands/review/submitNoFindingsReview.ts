import { appendCiFooter } from "./appendCiFooter";
import { buildReviewSummary } from "./buildReviewSummary";
import { sanitiseReviewerNames } from "./sanitiseReviewerNames";
import { submitBodyOnlyReview } from "./submitBodyOnlyReview";

export function submitNoFindingsReview(
	markdown: string,
	ciFooter: string,
): boolean {
	const body = sanitiseReviewerNames(
		`${buildReviewSummary(markdown)}\n\nNo findings were raised.`,
	);
	return submitBodyOnlyReview(appendCiFooter(body, ciFooter));
}
