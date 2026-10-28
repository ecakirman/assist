import type { PersistedComment } from "../../PersistedComment";

function nearestIndex(text: string, quote: string, near: number): number {
	let best = -1;
	for (let i = text.indexOf(quote); i !== -1; i = text.indexOf(quote, i + 1))
		if (best === -1 || Math.abs(i - near) < Math.abs(best - near)) best = i;
	return best;
}

export function carryOverComments(
	comments: PersistedComment[],
	text: string,
): PersistedComment[] {
	return comments.flatMap((c) => {
		const start = nearestIndex(text, c.quote, c.start);
		return start === -1 ? [] : [{ ...c, start, end: start + c.quote.length }];
	});
}
