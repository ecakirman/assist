import { fileURLToPath } from "node:url";
import { docsScreenshotsSchema } from "../docsPageSchema";
import { docsPaths } from "../docsPaths";
import { renderScreenshot } from "./renderScreenshot";

type PluginContext = {
	fileURL: URL | undefined;
	data: { astro?: { frontmatter?: { screenshots?: unknown } } };
};

type LeafDirective = {
	name: string;
	attributes?: Record<string, string | null | undefined> | null;
};

type VisitorContext = {
	replaceNode(
		node: LeafDirective,
		replacement: { type: "html"; value: string },
	): void;
};

function declaredScreenshots(data: PluginContext["data"]) {
	const result = docsScreenshotsSchema.safeParse(
		data.astro?.frontmatter?.screenshots,
	);
	return new Map((result.data ?? []).map((shot) => [shot.file, shot]));
}

export function screenshotsPlugin(basePath: string) {
	return ({ fileURL, data }: PluginContext) => {
		const path = fileURL && fileURLToPath(fileURL);
		if (!path?.startsWith(docsPaths.pagesDir)) return undefined;
		const declared = declaredScreenshots(data);
		const placed = new Set<string>();
		return {
			name: "assist-docs-screenshots",
			leafDirective(node: LeafDirective, ctx: VisitorContext) {
				if (node.name !== "screenshot") return;
				const file = node.attributes?.file ?? "";
				const screenshot = declared.get(file);
				if (!screenshot)
					throw new Error(`${path}: ::screenshot of undeclared file "${file}"`);
				placed.add(file);
				ctx.replaceNode(node, {
					type: "html",
					value: renderScreenshot(screenshot, basePath),
				});
			},
			after() {
				const unplaced = [...declared.keys()].filter(
					(file) => !placed.has(file),
				);
				if (unplaced.length > 0)
					throw new Error(
						`${path}: declared screenshots with no ::screenshot{file="<file>"} line: ${unplaced.join(", ")}`,
					);
			},
		};
	};
}
