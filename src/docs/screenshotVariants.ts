import type { DocsScreenshot } from "./docsPageSchema";

type ScreenshotVariant = { file: string; theme: "light" | "dark" };

export function darkVariantFile(file: string): string {
	return file.replace(/\.png$/, "-dark.png");
}

export function screenshotVariants(
	screenshot: DocsScreenshot,
): ScreenshotVariant[] {
	if (screenshot.theme)
		return [{ file: screenshot.file, theme: screenshot.theme }];
	return [
		{ file: screenshot.file, theme: "light" },
		{ file: darkVariantFile(screenshot.file), theme: "dark" },
	];
}
