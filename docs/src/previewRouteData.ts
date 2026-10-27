import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import { previewPageMeta } from "../../src/docs/starlight/previewPageMeta";

export const onRequest = defineRouteMiddleware(({ locals }) => {
	const { entry } = locals.starlightRoute;
	const { previewError } = entry.data as { previewError?: string };
	if (previewError)
		throw new Error(`docs/${entry.filePath} frontmatter:\n${previewError}`);
	locals.starlightRoute.head.push(
		...previewPageMeta({
			id: entry.id,
			title: entry.data.title,
			source: `docs/${entry.filePath}`,
		}),
	);
});
