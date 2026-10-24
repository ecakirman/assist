import { existsSync } from "node:fs";
import { join } from "node:path";
import type { DocsPage } from "../docsPageSchema";

export function findMissingScreenshots(
	pages: DocsPage[],
	screenshotsDir: string,
): string[] {
	return pages.flatMap((page) =>
		page.sections
			.flatMap((section) => section.screenshots ?? [])
			.filter(
				(screenshot) => !existsSync(join(screenshotsDir, screenshot.file)),
			)
			.map((screenshot) => `${page.id}: ${screenshot.file}`),
	);
}
