import type { PreviewReviewSide } from "../../sessions/shared/PreviewDecision";

export type HunkLines = Record<PreviewReviewSide, Set<number>>;

const HUNK_HEADER = /^@@ -(\d+)(?:,\d+)? \+(\d+)/;

export function patchHunkLines(patch: string): HunkLines[] {
	const hunks: HunkLines[] = [];
	let current: HunkLines | undefined;
	let left = 0;
	let right = 0;
	for (const line of patch.split("\n")) {
		const header = HUNK_HEADER.exec(line);
		if (header) {
			current = { LEFT: new Set(), RIGHT: new Set() };
			hunks.push(current);
			left = Number(header[1]);
			right = Number(header[2]);
		} else if (!current || line.startsWith("\\")) continue;
		else if (line.startsWith("+")) current.RIGHT.add(right++);
		else if (line.startsWith("-")) current.LEFT.add(left++);
		else {
			current.LEFT.add(left++);
			current.RIGHT.add(right++);
		}
	}
	return hunks;
}
