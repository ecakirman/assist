import type { PreviewReviewComment } from "../../sessions/shared/PreviewDecision";

export function formatReviewComment({
	path,
	startLine,
	endLine,
	quote,
	note,
}: PreviewReviewComment): string {
	const lines =
		startLine === endLine ? `${startLine}` : `${startLine}-${endLine}`;
	return `- \`${path}:${lines}\` ${quote}: ${note.replace(/\n/g, "\n  ")}`;
}
