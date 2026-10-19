import {
	type ChangeData,
	computeNewLineNumber,
	computeOldLineNumber,
} from "react-diff-view";
import type { PreviewReviewSide } from "../../../../../shared/PreviewDecision";
import type { DiffChangeIndex } from "../buildChangeIndex";
import { diffRangeEndpoints } from "./resolveDiffRange/diffRangeEndpoints";
import {
	type DiffSide,
	resolveDiffSide,
} from "./resolveDiffRange/resolveDiffSide";
import { type SelectedChange, selectedChanges } from "../selectedChanges";
import { quoteOf } from "./resolveDiffRange/quoteOf";

type ResolvedDiffRange = {
	startLine: number;
	endLine: number;
	startSide: PreviewReviewSide;
	side: PreviewReviewSide;
	quote: string;
	changes: SelectedChange[];
};

function onSide(side: DiffSide | null): (change: ChangeData) => boolean {
	if (side === "old") return (change) => change.type !== "insert";
	if (side === "new") return (change) => change.type !== "delete";
	return () => true;
}

function lineOf(change: ChangeData): number {
	return change.type === "delete"
		? computeOldLineNumber(change)
		: computeNewLineNumber(change);
}

function sideOf(change: ChangeData): PreviewReviewSide {
	return change.type === "delete" ? "LEFT" : "RIGHT";
}

export function resolveDiffRange(
	range: Range,
	index: DiffChangeIndex,
): ResolvedDiffRange | null {
	const ends = diffRangeEndpoints(range, index);
	if (!ends) return null;

	const { start, end } = ends;
	const [from, to] = [start.position, end.position].sort((a, b) => a - b);
	const spanned = index.changes
		.slice(from, to + 1)
		.filter(onSide(resolveDiffSide(start, end)));
	const quoted = spanned.length > 0 ? spanned : [start.change];

	const quote = quoteOf(range, start, end, quoted);
	if (!quote.trim()) return null;

	const first = quoted[0];
	const last = quoted[quoted.length - 1];
	return {
		startLine: lineOf(first),
		endLine: lineOf(last),
		startSide: sideOf(first),
		side: sideOf(last),
		quote,
		changes: selectedChanges(quoted),
	};
}
