import type {
	PreviewReviewComment,
	PreviewReviewEvent,
} from "../../sessions/shared/PreviewDecision";
import { runGhOrThrow } from "../../../shared/runGhOrThrow";

export type HighLevelReviewSubmission = {
	event: PreviewReviewEvent;
	body: string;
	comments: PreviewReviewComment[];
};

function toLineComment(comment: PreviewReviewComment) {
	const side = comment.side ?? "RIGHT";
	const startSide = comment.startSide ?? "RIGHT";
	const single = comment.startLine === comment.endLine && startSide === side;
	return {
		path: comment.path,
		body: comment.note,
		line: comment.endLine,
		side,
		...(single ? {} : { start_line: comment.startLine, start_side: startSide }),
	};
}

export function postHighLevelReview(
	repo: string,
	prNumber: number,
	{ event, body, comments }: HighLevelReviewSubmission,
): void {
	const payload = {
		event,
		...(body ? { body } : {}),
		comments: comments.map(toLineComment),
	};
	runGhOrThrow(
		[
			"api",
			`repos/${repo}/pulls/${prNumber}/reviews`,
			"--method",
			"POST",
			"--input",
			"-",
		],
		`Could not review ${repo}#${prNumber}`,
		JSON.stringify(payload),
	);
}
