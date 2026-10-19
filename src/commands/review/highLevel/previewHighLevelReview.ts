import { randomUUID } from "node:crypto";
import { awaitPreviewApproval } from "../../sessions/shared/awaitPreviewApproval";
import type { PreviewReviewEvent } from "../../sessions/shared/PreviewDecision";
import { formatHighLevelReviewPreview } from "./formatHighLevelReviewPreview";
import type { HighLevelReviewSubmission } from "./postHighLevelReview";
import type { HighLevelReviewRecord } from "./types";

const LABELS: Record<PreviewReviewEvent, string> = {
	APPROVE: "Approve",
	COMMENT: "Comment on",
	REQUEST_CHANGES: "Request changes on",
};

export async function previewHighLevelReview(
	sessionId: string,
	record: HighLevelReviewRecord,
	submission: HighLevelReviewSubmission,
): Promise<boolean> {
	const decision = await awaitPreviewApproval(
		"Review",
		{
			sessionId,
			requestId: randomUUID(),
			title: `${LABELS[submission.event]} ${record.repo}#${record.prNumber}`,
			body: formatHighLevelReviewPreview(submission.comments, submission.body),
			prNumber: record.prNumber,
			kind: "pr-comment",
		},
		{ rejectIsOutcome: true },
	);
	return decision.decision === "approve" && !decision.dismissed;
}
