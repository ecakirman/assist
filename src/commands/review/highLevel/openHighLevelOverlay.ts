import { randomUUID } from "node:crypto";
import { awaitPreviewApproval } from "../../sessions/shared/awaitPreviewApproval";
import { buildHighLevelRecord } from "./buildHighLevelRecord";
import { formatHighLevelApprovalBody } from "./formatHighLevelApprovalBody";
import { highLevelPreviewMetadata } from "./highLevelPreviewMetadata";
import { highLevelPreviewPayload } from "./highLevelPreviewPayload";
import type { HighLevelOverlaySubject } from "./HighLevelOverlaySubject";
import { postHighLevelApproval } from "./postHighLevelApproval";
import { saveHighLevelReview } from "./saveHighLevelReview";
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
	if (record.verdict === "approve") approveOnGitHub(record);
	else console.log("Nothing was posted to GitHub.");
	return record;
}

function approveOnGitHub(record: HighLevelReviewRecord): void {
	const target = `${record.repo}#${record.prNumber}`;
	try {
		postHighLevelApproval(
			record.repo,
			record.prNumber,
			formatHighLevelApprovalBody(record.items),
		);
	} catch (error) {
		console.error(
			`Could not post the approval to ${target}: ${(error as Error).message}`,
		);
		process.exit(1);
	}
	console.log(`Approval posted to ${target}.`);
}
