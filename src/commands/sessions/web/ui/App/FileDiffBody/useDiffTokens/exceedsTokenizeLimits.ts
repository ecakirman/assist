import type { HunkData } from "react-diff-view";

export const MAX_TOKENIZED_LINE_LENGTH = 2_000;
export const MAX_TOKENIZED_FILE_LENGTH = 200_000;

export function exceedsTokenizeLimits(hunks: HunkData[]): boolean {
	let total = 0;
	for (const hunk of hunks) {
		for (const change of hunk.changes) {
			if (change.content.length > MAX_TOKENIZED_LINE_LENGTH) return true;
			total += change.content.length;
			if (total > MAX_TOKENIZED_FILE_LENGTH) return true;
		}
	}
	return false;
}
