import type { PreviewDecision } from "../../sessions/shared/PreviewDecision";
import { highLevelReviewEvent } from "./highLevelReviewEvent";
import type {
	HighLevelCheckResult,
	HighLevelReviewItem,
	HighLevelReviewRecord,
} from "./types";

type RecordSubject = {
	repo: string;
	prNumber: number;
	headRef: string;
	headSha: string;
	checks: HighLevelCheckResult[];
};

const VERDICTS = {
	APPROVE: "approve",
	COMMENT: "comment",
	REQUEST_CHANGES: "request-changes",
} as const;

function toItem(
	check: HighLevelCheckResult,
	decision: PreviewDecision,
): HighLevelReviewItem {
	const ticked = decision.checklist?.find((entry) => entry.id === check.id);
	const comment = ticked?.comment?.trim();
	return {
		id: check.id,
		kind: check.kind,
		title: check.title,
		status: check.status,
		reason: check.reason,
		ticked: ticked?.ticked ?? check.status === "pass",
		...(comment ? { comment } : {}),
	};
}

export function buildHighLevelRecord(
	subject: RecordSubject,
	decision: PreviewDecision,
): HighLevelReviewRecord {
	const { checks, repo, prNumber, headRef, headSha } = subject;
	const reviewComments = decision.reviewComments ?? [];
	return {
		repo,
		prNumber,
		headRef,
		headSha,
		verdict: VERDICTS[highLevelReviewEvent(decision)],
		reviewedAt: new Date().toISOString(),
		items: checks.map((check) => toItem(check, decision)),
		...(reviewComments.length > 0 ? { reviewComments } : {}),
	};
}
