import { Marked } from "marked";
import type { DocsPage, DocsScreenshot } from "../docsPageSchema";
import { darkVariantFile } from "../screenshotVariants";
import { escapeHtml } from "./escapeHtml";
import type { DocsNavGroup } from "./orderDocsPages";
import { renderDocsNav } from "./renderDocsNav";

type Section = DocsPage["sections"][number];

const marked = new Marked({ gfm: true });

function renderScreenshot(
	screenshot: DocsScreenshot,
	basePath: string,
): string {
	const alt = escapeHtml(screenshot.alt);
	const src = `${basePath}screenshots/`;
	const img = `<img src="${src}${screenshot.file}" alt="${alt}" loading="lazy">`;
	const image = screenshot.theme
		? img
		: `<picture><source srcset="${src}${darkVariantFile(screenshot.file)}" media="(prefers-color-scheme: dark)">${img}</picture>`;
	return `<figure>${image}<figcaption>${alt}</figcaption></figure>`;
}

function renderSection(section: Section, basePath: string): string {
	const body = marked.parse(section.markdown, { async: false });
	const screenshots = (section.screenshots ?? [])
		.map((screenshot) => renderScreenshot(screenshot, basePath))
		.join("");
	return `<section><h2>${escapeHtml(section.heading)}</h2>${body}${screenshots}</section>`;
}

export function renderDocsPage(
	page: DocsPage,
	nav: DocsNavGroup[],
	basePath: string,
): string {
	const title = escapeHtml(page.title);
	const sections = page.sections
		.map((section) => renderSection(section, basePath))
		.join("");
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · assist</title>
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
