import { satteri } from "@astrojs/markdown-satteri";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { docsSidebar } from "../src/docs/starlight/docsSidebar";
import { normalizeBasePath } from "../src/docs/starlight/normalizeBasePath";
import { screenshotsPlugin } from "../src/docs/starlight/screenshotsPlugin";

const base = normalizeBasePath(process.env.DOCS_BASE_PATH ?? "/");
const sidebar = docsSidebar();

export default defineConfig({
	base,
	redirects: { "/": `${base}${sidebar[0].items[0]}/` },
	markdown: {
		processor: satteri({ mdastPlugins: [screenshotsPlugin(base)] }),
	},
	integrations: [
		starlight({
			title: "assist",
			sidebar,
			pagination: false,
		}),
	],
});
