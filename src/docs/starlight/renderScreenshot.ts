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
		const src = `${basePath}screenshots/${file}`;
		return `<a href="${src}" target="_blank" title="Open full size"${hidden}><img src="${src}" alt="${alt}" loading="lazy"></a>`;
	};
	const image = screenshot.theme
		? img(screenshot.file)
		: img(screenshot.file, "dark") +
			img(darkVariantFile(screenshot.file), "light");
	return `<figure>${image}<figcaption>${alt}</figcaption></figure>`;
}
