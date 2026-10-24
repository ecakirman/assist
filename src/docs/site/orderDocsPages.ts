import { type DocsPage, docsNavGroups } from "../docsPageSchema";

export type DocsNavGroup = {
	group: DocsPage["group"];
	pages: DocsPage[];
};

export function orderDocsPages(pages: DocsPage[]): DocsNavGroup[] {
	return docsNavGroups
		.map((group) => ({
			group,
			pages: pages
				.filter((page) => page.group === group)
				.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
		}))
		.filter((entry) => entry.pages.length > 0);
}
