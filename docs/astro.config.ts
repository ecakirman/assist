import { satteri } from "@astrojs/markdown-satteri";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { docsSectionsPlugin } from "../src/docs/starlight/docsSectionsPlugin";
import { kbdPlugin } from "../src/docs/starlight/kbdPlugin";
import { docsSidebar } from "../src/docs/starlight/docsSidebar";
import { normalizeBasePath } from "../src/docs/starlight/normalizeBasePath";
import { badgePlugin } from "../src/docs/starlight/badgePlugin";
import { iconPlugin } from "../src/docs/starlight/iconPlugin";
import { screenshotsPlugin } from "../src/docs/starlight/screenshotsPlugin";
import { statusPlugin } from "../src/docs/starlight/statusPlugin";

const base = normalizeBasePath(process.env.DOCS_BASE_PATH ?? "/");
const sidebar = docsSidebar();
const preview = process.env.NODE_ENV === "development";

export default defineConfig({
	base,
	redirects: { "/": `${base}${sidebar[0].items[0]}/` },
	markdown: {
		processor: satteri({
			mdastPlugins: [
				screenshotsPlugin(base),
				kbdPlugin,
				statusPlugin,
				badgePlugin,
				iconPlugin,
			],
			hastPlugins: preview ? [docsSectionsPlugin()] : [],
		}),
	},
	integrations: [
		starlight({
			title: "assist",
			favicon: "/favicon.png",
			logo: { src: "../extension/icons/assist-128.png", alt: "" },
			sidebar,
			pagination: false,
			customCss: [
				"./src/styles/kbd.css",
				"./src/styles/screenshot.css",
				"./src/styles/dashboard.css",
				"./src/styles/header.css",
			],
			head: [
				{
					tag: "script",
					content:
						"if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) document.documentElement.dataset.os = 'mac';",
				},
			],
			routeMiddleware: preview ? "./src/previewRouteData.ts" : [],
		}),
		{
			name: "assist-docs-preview",
			hooks: {
				"astro:config:setup": ({ injectScript }) => {
					injectScript("page", 'import "/src/screenshotLightbox.ts";');
					if (preview) injectScript("page", 'import "/src/previewReload.ts";');
				},
			},
		},
	],
});
