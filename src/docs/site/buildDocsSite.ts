import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { docsPaths } from "../docsPaths";
import { findUnknownCovers } from "../findUnknownCovers";
import { findUnknownScenes } from "../findUnknownScenes";
import { loadCaptureScenes } from "../loadCaptureScenes";
import { collectDocsInventory } from "../inventory/collectDocsInventory";
import { loadDocsPages } from "../loadDocsPages";
import { findMissingScreenshots } from "./findMissingScreenshots";
import { normalizeBasePath } from "./normalizeBasePath";
import { renderDocsSite } from "./renderDocsSite";

function failOn(label: string, problems: string[]): void {
	if (problems.length > 0)
		throw new Error(`${label}:\n${problems.map((p) => `  ${p}`).join("\n")}`);
}

export function buildDocsSite(
	basePath: string,
	outDir: string,
	preview = false,
): number {
	const pages = loadDocsPages(docsPaths.pagesDir);
	const inventory = new Set(collectDocsInventory().map((item) => item.id));
	failOn(
		"Docs pages cover ids that are not in the inventory",
		findUnknownCovers(pages, inventory),
	);
	failOn(
		`Screenshots use scenes not declared in ${docsPaths.captureScenes}`,
		findUnknownScenes(pages, loadCaptureScenes(docsPaths.captureScenes)),
	);
	failOn(
		`Screenshots missing from ${docsPaths.screenshotsDir}`,
		findMissingScreenshots(pages, docsPaths.screenshotsDir),
	);

	rmSync(outDir, { recursive: true, force: true });
	for (const file of renderDocsSite(
		pages,
		normalizeBasePath(basePath),
		preview,
	)) {
		const target = join(outDir, file.path);
		mkdirSync(dirname(target), { recursive: true });
		writeFileSync(target, file.content);
	}
	cpSync(docsPaths.stylesheet, join(outDir, "styles.css"));
	if (existsSync(docsPaths.screenshotsDir))
		cpSync(docsPaths.screenshotsDir, join(outDir, "screenshots"), {
			recursive: true,
		});
	return pages.length;
}
