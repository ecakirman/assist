import { printReviewerFailures } from "./printReviewerFailures";
import type { ReviewerResult } from "./runStreamingChild";

export function reportFailures(
	failures: ReviewerResult[],
	usingSpinner: boolean,
): void {
	if (failures.length === 0) return;
	// In spinner mode failure detail is deferred so it survives the
	// in-place rendering; in non-spinner mode logChildClose has already
	// printed it inline as each reviewer exits.
	if (!usingSpinner) return;
	printReviewerFailures(failures);
}
