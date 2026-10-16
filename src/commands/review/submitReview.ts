import { submitBodyOnlyReview } from "./submitBodyOnlyReview";
import { submitPendingReview } from "./submitPendingReview";

type PostResult = { posted: number; failed: number };

export function submitReview(body: string, result: PostResult): boolean {
	if (result.posted > 0) return submitPendingReview(body);
	if (submitPendingLeftByFailedThreads(body, result)) return true;
	return submitBodyOnlyReview(body);
}

function submitPendingLeftByFailedThreads(
	body: string,
	result: PostResult,
): boolean {
	return result.failed > 0 && submitPendingReview(body);
}
