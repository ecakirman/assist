import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import { previewPageMeta } from "../../src/docs/starlight/previewPageMeta";

export const onRequest = defineRouteMiddleware(({ locals }) => {
	const { entry } = locals.starlightRoute;
	locals.starlightRoute.head.push(
		...previewPageMeta({
			id: entry.id,
			title: entry.data.title,
			source: `docs/${entry.filePath}`,
		}),
	);
});
