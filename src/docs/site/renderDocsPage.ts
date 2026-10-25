import { Marked } from "marked";
import type { DocsPage } from "../docsPageSchema";
import { screenshotPlaceholder } from "../screenshotPlaceholder";
import { escapeHtml } from "./escapeHtml";
import type { DocsNavGroup } from "./orderDocsPages";
import { renderDocsNav } from "./renderDocsNav";
import { previewMeta } from "./previewMeta";
import { sectionAttributes } from "./sectionAttributes";
import { renderScreenshot } from "./renderScreenshot";

type Section = DocsPage["sections"][number];

const marked = new Marked({ gfm: true });

function renderSection(
	section: Section,
	basePath: string,
	attributes = "",
): string {
	let markdown = section.markdown;
	const trailing: string[] = [];
	for (const screenshot of section.screenshots ?? []) {
		const figure = renderScreenshot(screenshot, basePath);
		const placeholder = screenshotPlaceholder(screenshot.file);
		if (markdown.includes(placeholder))
			markdown = markdown.replace(placeholder, `\n\n${figure}\n\n`);
		else trailing.push(figure);
	}
	const body = marked.parse(markdown, { async: false });
	const screenshots = trailing.join("");
	return `<section${attributes}><h2>${escapeHtml(section.heading)}</h2>${body}${screenshots}</section>`;
}

export function renderDocsPage(
	page: DocsPage,
	nav: DocsNavGroup[],
	basePath: string,
	preview = false,
): string {
	const title = escapeHtml(page.title);
	const sections = page.sections
		.map((section) =>
			renderSection(
				section,
				basePath,
				preview ? sectionAttributes(section, page.source) : undefined,
			),
		)
		.join("");
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${preview ? previewMeta(page) : ""}<title>${title} · assist</title>
<link rel="stylesheet" href="${basePath}styles.css">
</head>
<body>
<div class="layout">
${renderDocsNav(nav, page.id, basePath)}
<main><h1>${title}</h1>${sections}</main>
</div>
</body>
</html>
`;
}
