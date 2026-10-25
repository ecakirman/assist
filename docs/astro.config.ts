import { satteri } from "@astrojs/markdown-satteri";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { docsSectionsPlugin } from "../src/docs/starlight/docsSectionsPlugin";
import { docsSidebar } from "../src/docs/starlight/docsSidebar";
import { normalizeBasePath } from "../src/docs/starlight/normalizeBasePath";
import { screenshotsPlugin } from "../src/docs/starlight/screenshotsPlugin";

const base = normalizeBasePath(process.env.DOCS_BASE_PATH ?? "/");
const sidebar = docsSidebar();
const preview = process.env.NODE_ENV === "development";

export default defineConfig({
	base,
	redirects: { "/": `${base}${sidebar[0].items[0]}/` },
	markdown: {
		processor: satteri({
			mdastPlugins: [screenshotsPlugin(base)],
			hastPlugins: preview ? [docsSectionsPlugin()] : [],
		}),
	},
	integrations: [
		starlight({
			title: "assist",
			sidebar,
			pagination: false,
			routeMiddleware: preview ? "./src/previewRouteData.ts" : [],
		}),
		{
			name: "assist-docs-preview",
			hooks: {
				"astro:config:setup": ({ injectScript }) => {
					if (preview) injectScript("page", 'import "/src/previewReload.ts";');
				},
			},
		},
	],
});
