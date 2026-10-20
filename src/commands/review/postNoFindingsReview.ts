import type { PostOutcome } from "./postAndMaybeSubmit";
import { submitNoFindingsReview } from "./submitNoFindingsReview";

export function postNoFindingsReview(
	markdown: string,
	ciFooter: string | undefined,
): PostOutcome {
	if (!ciFooter) return { posted: 0, submitted: false };
	if (!submitNoFindingsReview(markdown, ciFooter))
		throw new Error("the review could not be submitted to the PR");
	return { posted: 0, submitted: true };
}
