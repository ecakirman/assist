import type { PreviewReviewComment } from "../../../shared/PreviewDecision";
import { formatQuotedComment } from "./formatQuotedComment";

export type DiffComment = PreviewReviewComment;

export function formatDiffComment({
	path,
	startLine,
	endLine,
	quote,
	note,
}: DiffComment): string {
	const lines =
		startLine === endLine ? `${startLine}` : `${startLine}-${endLine}`;
	return `${path}:${lines}\n\n${formatQuotedComment(quote, note)}`;
}
