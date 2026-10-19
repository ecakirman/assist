import { randomUUID } from "node:crypto";
import { awaitPreviewApproval } from "../../sessions/shared/awaitPreviewApproval";
import type { PreviewReviewEvent } from "../../sessions/shared/PreviewDecision";
import { formatHighLevelReviewBody } from "./formatHighLevelReviewBody";
import { postHighLevelReview } from "./postHighLevelReview";
import type { HighLevelReviewRecord } from "./types";

const EVENTS: Record<HighLevelReviewRecord["verdict"], PreviewReviewEvent> = {
	approve: "APPROVE",
	comment: "COMMENT",
	"request-changes": "REQUEST_CHANGES",
};

const LABELS: Record<PreviewReviewEvent, string> = {
	APPROVE: "Approve",
	COMMENT: "Comment on",
	REQUEST_CHANGES: "Request changes on",
};

function post(
	record: HighLevelReviewRecord,
	event: PreviewReviewEvent,
	body: string,
): void {
	const target = `${record.repo}#${record.prNumber}`;
	try {
		postHighLevelReview(record.repo, record.prNumber, event, body);
	} catch (error) {
		console.error(
			`Could not post the review to ${target}: ${(error as Error).message}`,
		);
		process.exit(1);
	}
	console.log(`Review (${event}) posted to ${target}.`);
}

async function previewApproved(
	sessionId: string,
	record: HighLevelReviewRecord,
	event: PreviewReviewEvent,
	body: string,
): Promise<boolean> {
	const decision = await awaitPreviewApproval(
		"Review",
		{
			sessionId,
			requestId: randomUUID(),
			title: `${LABELS[event]} ${record.repo}#${record.prNumber}`,
			body,
			prNumber: record.prNumber,
			kind: "pr-comment",
		},
		{ rejectIsOutcome: true },
	);
	return decision.decision === "approve" && !decision.dismissed;
}

export async function submitHighLevelReview(
	sessionId: string,
	record: HighLevelReviewRecord,
): Promise<void> {
	const event = EVENTS[record.verdict];
	const body = formatHighLevelReviewBody(record.items, record.reviewComments);
	if (event === "APPROVE" && !record.reviewComments?.length)
		return post(record, event, body);
	if (body && (await previewApproved(sessionId, record, event, body)))
		return post(record, event, body);
	console.log("Nothing was posted to GitHub.");
}
