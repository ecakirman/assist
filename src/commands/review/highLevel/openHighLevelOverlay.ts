import { randomUUID } from "node:crypto";
import { awaitPreviewApproval } from "../../sessions/shared/awaitPreviewApproval";
import { buildHighLevelRecord } from "./buildHighLevelRecord";
import { highLevelPreviewMetadata } from "./highLevelPreviewMetadata";
import { highLevelPreviewPayload } from "./highLevelPreviewPayload";
import type { HighLevelOverlaySubject } from "./HighLevelOverlaySubject";
import { saveHighLevelReview } from "./saveHighLevelReview";
import { submitHighLevelReview } from "./submitHighLevelReview";
import type { HighLevelReviewRecord } from "./types";

export async function openHighLevelOverlay(
	sessionId: string,
	subject: HighLevelOverlaySubject,
): Promise<HighLevelReviewRecord | undefined> {
	const decision = await awaitPreviewApproval(
		"High-level review",
		{
			sessionId,
			requestId: randomUUID(),
			title: `${subject.repo}#${subject.prNumber} — ${subject.title}`,
			body: JSON.stringify(highLevelPreviewPayload(subject)),
			prNumber: subject.prNumber,
			kind: "high-level-review",
			metadata: highLevelPreviewMetadata(subject),
		},
		{ rejectIsOutcome: true },
	);
	if (decision.dismissed) {
		console.log("Review closed without a verdict. Nothing was saved.");
		return undefined;
	}
	const record = buildHighLevelRecord(subject, decision);
	saveHighLevelReview(record);
	console.log(`Verdict: ${record.verdict}`);
	await submitHighLevelReview(sessionId, record);
	return record;
}
