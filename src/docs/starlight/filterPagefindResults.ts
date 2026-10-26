type PagefindResultData = {
	content: string;
	locations: number[];
	meta: { title?: string };
};

type PagefindResponse<R> = { results: R[] } | null;

export async function filterPagefindResults<
	R extends { data(): Promise<PagefindResultData> },
>(response: PagefindResponse<R>, term: unknown): Promise<PagefindResponse<R>> {
	if (!response || typeof term !== "string") return response;
	const wordsOf = (text: string) =>
		text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
	const queryWords = wordsOf(term);
	if (queryWords.length === 0) return response;
	const sharedPrefixLength = (a: string, b: string) => {
		let i = 0;
		while (i < a.length && i < b.length && a[i] === b[i]) i++;
		return i;
	};
	const minimumSharedPrefix = 3;
	const coversQuery = (data: PagefindResultData) => {
		const contentWords = data.content.split(/\s+/);
		const matchedWords = data.locations
			.map((location) => contentWords[location] ?? "")
			.concat(data.meta.title ?? "")
			.flatMap(wordsOf);
		return queryWords.every((word) =>
			matchedWords.some(
				(matched) =>
					sharedPrefixLength(matched, word) >=
					Math.min(word.length, minimumSharedPrefix),
			),
		);
	};
	const kept = await Promise.all(
		response.results.map(async (result) =>
			coversQuery(await result.data()) ? result : null,
		),
	);
	return {
		...response,
		results: kept.filter((result) => result !== null),
	};
}
