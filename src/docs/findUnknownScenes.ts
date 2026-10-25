import type { DocsPage } from "./docsPageSchema";
import type { CaptureScenes } from "./loadCaptureScenes";

export function findUnknownScenes(
	pages: DocsPage[],
	scenes: CaptureScenes,
): string[] {
	return pages.flatMap((page) =>
		(page.screenshots ?? [])
			.filter((screenshot) => screenshot.scene && !scenes[screenshot.scene])
			.map(
				(screenshot) => `${page.id}: ${screenshot.file} (${screenshot.scene})`,
			),
	);
}
