import type { PreviewReviewComment } from "../../sessions/shared/PreviewDecision";
import { type HunkLines, patchHunkLines } from "./patchHunkLines";
import type { HighLevelFile } from "./types";

export type SplitReviewComments = {
	lineLevel: PreviewReviewComment[];
	remainder: PreviewReviewComment[];
};

function inHunk(comment: PreviewReviewComment, hunk: HunkLines): boolean {
	return (
		hunk[comment.startSide ?? "RIGHT"].has(comment.startLine) &&
		hunk[comment.side ?? "RIGHT"].has(comment.endLine)
	);
}

export function splitHighLevelReviewComments(
	comments: PreviewReviewComment[],
	files: Pick<HighLevelFile, "path" | "patch">[],
): SplitReviewComments {
	const hunks = new Map(
		files.map((file) => [file.path, patchHunkLines(file.patch ?? "")]),
	);
	const split: SplitReviewComments = { lineLevel: [], remainder: [] };
	for (const comment of comments) {
		const onDiff = hunks
			.get(comment.path)
			?.some((hunk) => inHunk(comment, hunk));
		(onDiff ? split.lineLevel : split.remainder).push(comment);
	}
	return split;
}
