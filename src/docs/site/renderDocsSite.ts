import type { DocsPage } from "../docsPageSchema";
import type { DocsPreviewStamp } from "./DocsPreviewStamp";
import { orderDocsPages } from "./orderDocsPages";
import { renderDocsPage } from "./renderDocsPage";

export function renderDocsSite(
	pages: DocsPage[],
	basePath: string,
	stamp?: DocsPreviewStamp,
): { path: string; content: string }[] {
	const nav = orderDocsPages(pages);
	const ordered = nav.flatMap((entry) => entry.pages);
	const files = ordered.map((page) => ({
		path: `${page.id}/index.html`,
		content: renderDocsPage(page, nav, basePath, stamp),
	}));
	if (ordered.length > 0)
		files.push({
			path: "index.html",
			content: renderDocsPage(ordered[0], nav, basePath, stamp),
		});
	return files;
}
