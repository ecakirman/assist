import type { HistorySnippet } from "../../shared/HistorySnippet";

const CONTEXT_CHARS = 60;

function collapse(text: string): string {
	return text.replace(/\s+/g, " ");
}

export function historySnippet(
	text: string,
	index: number,
	length: number,
): HistorySnippet {
	const start = Math.max(0, index - CONTEXT_CHARS);
	const end = Math.min(text.length, index + length + CONTEXT_CHARS);
	const before = collapse(text.slice(start, index)).trimStart();
	const after = collapse(text.slice(index + length, end)).trimEnd();
	return {
		before: start > 0 ? `…${before}` : before,
		match: collapse(text.slice(index, index + length)),
		after: end < text.length ? `${after}…` : after,
	};
}
