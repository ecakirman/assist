import type { PreviewReviewEvent } from "../../sessions/shared/PreviewDecision";
import { runGhOrThrow } from "../../../shared/runGhOrThrow";

const FLAGS: Record<PreviewReviewEvent, string> = {
	APPROVE: "--approve",
	COMMENT: "--comment",
	REQUEST_CHANGES: "--request-changes",
};

export function postHighLevelReview(
	repo: string,
	prNumber: number,
	event: PreviewReviewEvent,
	body: string,
): void {
	const args = ["pr", "review", String(prNumber), "--repo", repo, FLAGS[event]];
	if (body) args.push("--body", body);
	runGhOrThrow(args, `Could not review ${repo}#${prNumber}`);
}
