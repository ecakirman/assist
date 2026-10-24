import type { DocsScreenshot } from "../docsPageSchema";
import { darkVariantFile } from "../screenshotVariants";
import { escapeHtml } from "./escapeHtml";

export function renderScreenshot(
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
