import { existsSync } from "node:fs";
import { join } from "node:path";
import type { DocsPage } from "../docsPageSchema";
import { screenshotVariants } from "../screenshotVariants";

export function findMissingScreenshots(
	pages: DocsPage[],
	screenshotsDir: string,
): string[] {
	return pages.flatMap((page) =>
		page.sections
			.flatMap((section) => section.screenshots ?? [])
			.flatMap(screenshotVariants)
			.filter((variant) => !existsSync(join(screenshotsDir, variant.file)))
			.map((variant) => `${page.id}: ${variant.file}`),
	);
}
