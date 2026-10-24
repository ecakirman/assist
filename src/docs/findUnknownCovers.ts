import type { DocsPage } from "./docsPageSchema";

export function findUnknownCovers(
	pages: DocsPage[],
	inventory: ReadonlySet<string>,
): string[] {
	return pages.flatMap((page) =>
		page.covers
			.filter((id) => !inventory.has(id))
			.map((id) => `${page.id}: ${id}`),
	);
}
