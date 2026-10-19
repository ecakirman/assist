type TextSegment = { text: string; start: number; match: boolean };

export function splitOnTerm(text: string, term: string): TextSegment[] {
	if (!term) return [{ text, start: 0, match: false }];
	const haystack = text.toLowerCase();
	const needle = term.toLowerCase();
	const segments: TextSegment[] = [];
	const push = (start: number, end: number, match: boolean) =>
		segments.push({ text: text.slice(start, end), start, match });
	let from = 0;
	for (
		let at = haystack.indexOf(needle);
		at !== -1;
		at = haystack.indexOf(needle, from)
	) {
		if (at > from) push(from, at, false);
		push(at, at + needle.length, true);
		from = at + needle.length;
	}
	if (from < text.length) push(from, text.length, false);
	return segments;
}
