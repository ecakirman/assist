import type { PreviewReviewComment } from "./PreviewDecision";

function isReviewComment(value: unknown): value is PreviewReviewComment {
	const comment = value as PreviewReviewComment | undefined;
	return (
		typeof comment?.path === "string" &&
		Number.isInteger(comment.startLine) &&
		Number.isInteger(comment.endLine) &&
		typeof comment.quote === "string" &&
		typeof comment.note === "string" &&
		comment.note.trim() !== ""
	);
}

export function toReviewComments(
	value: unknown,
): PreviewReviewComment[] | undefined {
	if (!Array.isArray(value)) return undefined;
	return value
		.filter(isReviewComment)
		.map(({ path, startLine, endLine, quote, note }) => ({
			path,
			startLine,
			endLine,
			quote,
			note,
		}));
}
