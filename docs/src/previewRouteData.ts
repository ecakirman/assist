import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import { previewPageMeta } from "../../src/docs/starlight/previewPageMeta";

export const onRequest = defineRouteMiddleware(({ locals }) => {
	const route = locals.starlightRoute;
	route.head.push(previewPageMeta(route.entry.id));
});
