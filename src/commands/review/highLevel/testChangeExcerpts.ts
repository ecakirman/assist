import type { HighLevelTestExcerpt } from "./types";

const CONTEXT_LINES = 3;

export function testChangeExcerpts(
	source: string,
	line: number,
	changedLines: number[],
): HighLevelTestExcerpt[] {
	const lines = source.split("\n");
	const windows: { start: number; end: number }[] = [];
	for (const changed of [...changedLines].sort((a, b) => a - b)) {
		const start = Math.max(0, changed - line - CONTEXT_LINES);
		const end = Math.min(lines.length - 1, changed - line + CONTEXT_LINES);
		const last = windows.at(-1);
		if (last && start <= last.end + 1) last.end = Math.max(last.end, end);
		else windows.push({ start, end });
	}
	return windows.map(({ start, end }) => ({
		line: line + start,
		source: lines.slice(start, end + 1).join("\n"),
	}));
}
