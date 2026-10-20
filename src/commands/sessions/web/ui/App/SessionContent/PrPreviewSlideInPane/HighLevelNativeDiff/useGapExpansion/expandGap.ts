import { expandFromRawCode, type HunkData } from "react-diff-view";

function indexHeadByOldLine(headLines: string[], newMinusOld: number) {
	return newMinusOld >= 0
		? headLines.slice(newMinusOld)
		: [...Array<string>(-newMinusOld).fill(""), ...headLines];
}

export function expandGap(
	hunks: HunkData[],
	headLines: string[],
	index: number,
): HunkData[] {
	const previous = hunks[index - 1];
	const next = hunks[index];
	if (!previous || !next) return hunks;
	const oldStart = previous.oldStart + previous.oldLines;
	const newStart = previous.newStart + previous.newLines;
	return expandFromRawCode(
		hunks,
		indexHeadByOldLine(headLines, newStart - oldStart),
		oldStart,
		next.oldStart,
	);
}
