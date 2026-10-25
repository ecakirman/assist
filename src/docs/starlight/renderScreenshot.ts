import type { DocsScreenshot } from "../docsPageSchema";
import { darkVariantFile } from "../screenshotVariants";
import { escapeHtml } from "./escapeHtml";

export function renderScreenshot(
	screenshot: DocsScreenshot,
	basePath: string,
): string {
	const alt = escapeHtml(screenshot.alt);
	const img = (file: string, hiddenInTheme?: "light" | "dark") => {
		const hidden = hiddenInTheme ? ` class="${hiddenInTheme}:sl-hidden"` : "";
		return `<img src="${basePath}screenshots/${file}" alt="${alt}" loading="lazy"${hidden}>`;
	};
	const image = screenshot.theme
		? img(screenshot.file)
		: img(screenshot.file, "dark") +
			img(darkVariantFile(screenshot.file), "light");
	return `<figure>${image}<figcaption>${alt}</figcaption></figure>`;
}
