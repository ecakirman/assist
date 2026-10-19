import type {
	PreviewReviewComment,
	PreviewReviewSide,
} from "./PreviewDecision";

function isSide(value: unknown): value is PreviewReviewSide {
	return value === "LEFT" || value === "RIGHT";
}

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
		.map(({ path, startLine, endLine, quote, note, startSide, side }) => ({
			path,
			startLine,
			endLine,
			quote,
			note,
			...(isSide(startSide) ? { startSide } : {}),
			...(isSide(side) ? { side } : {}),
		}));
}
