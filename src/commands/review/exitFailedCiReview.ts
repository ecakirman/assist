import type { ReviewerResult } from "./runStreamingChild";
import { submitFailedReview } from "./submitFailedReview";

export function exitFailedCiReview(
	failures: ReviewerResult[],
	ci: { footer: string; runUrl?: string },
): never {
	console.error("Review failed; no findings were posted.");
	submitFailedReview(failures, ci.footer, ci.runUrl);
	process.exit(1);
}
