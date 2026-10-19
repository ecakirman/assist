import type { PreviewReviewEvent } from "../../sessions/shared/PreviewDecision";
import { formatHighLevelReviewBody } from "./formatHighLevelReviewBody";
import {
	type HighLevelReviewSubmission,
	postHighLevelReview,
} from "./postHighLevelReview";
import type { HighLevelReviewRecord } from "./types";
import { splitQueuedComments } from "./splitQueuedComments";
import { previewHighLevelReview } from "./previewHighLevelReview";

const EVENTS: Record<HighLevelReviewRecord["verdict"], PreviewReviewEvent> = {
	approve: "APPROVE",
	comment: "COMMENT",
	"request-changes": "REQUEST_CHANGES",
};

function post(
	record: HighLevelReviewRecord,
	submission: HighLevelReviewSubmission,
): void {
	const target = `${record.repo}#${record.prNumber}`;
	try {
		postHighLevelReview(record.repo, record.prNumber, submission);
	} catch (error) {
		console.error(
			`Could not post the review to ${target}: ${(error as Error).message}`,
		);
		process.exit(1);
	}
	console.log(`Review (${submission.event}) posted to ${target}.`);
}

export async function submitHighLevelReview(
	sessionId: string,
	record: HighLevelReviewRecord,
): Promise<void> {
	const event = EVENTS[record.verdict];
	const { lineLevel, remainder } = splitQueuedComments(record);
	const submission: HighLevelReviewSubmission = {
		event,
		body: formatHighLevelReviewBody(record.items, remainder),
		comments: lineLevel,
	};
	if (event === "APPROVE" && !record.reviewComments?.length)
		return post(record, submission);
	const hasContent = submission.body || lineLevel.length > 0;
	if (
		hasContent &&
		(await previewHighLevelReview(sessionId, record, submission))
	)
		return post(record, submission);
	console.log("Nothing was posted to GitHub.");
}
