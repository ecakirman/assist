type PageMeta = { title: string | undefined; source: string | undefined };

export function pageLevelSection(
	element: Element | null | undefined,
	{ title, source }: PageMeta,
): { heading: string; source: string } | undefined {
	if (!title || !source || !element?.closest("main")) return undefined;
	return { heading: title, source };
}
