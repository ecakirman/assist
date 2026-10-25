import { execFileSync } from "node:child_process";
import { z } from "zod";
import { docsPageSchema } from "../docsPageSchema";
import { docsPaths } from "../docsPaths";
import { findMissingScreenshots } from "../findMissingScreenshots";
import { findUnknownCovers } from "../findUnknownCovers";
import { findUnknownScenes } from "../findUnknownScenes";
import { loadCaptureScenes } from "../loadCaptureScenes";

function loadInventory(): Set<string> {
	const output = execFileSync(
		"npx",
		["tsx", "src/docs/printDocsInventory.ts"],
		{
			cwd: docsPaths.repoRoot,
			encoding: "utf8",
			shell: process.platform === "win32",
		},
	);
	return new Set(JSON.parse(output) as string[]);
}

function labelled(label: string, problems: string[]): string[] {
	return problems.map((problem) => `${label}: ${problem}`);
}

export function createDocsFrontmatterCheck(): (
	frontmatter: unknown,
) => string[] {
	const inventory = loadInventory();
	const scenes = loadCaptureScenes(docsPaths.captureScenes);
	return (frontmatter) => {
		const result = docsPageSchema.safeParse(frontmatter);
		if (!result.success) return [z.prettifyError(result.error)];
		const pages = [result.data];
		return [
			...labelled(
				"Covers id not in the inventory",
				findUnknownCovers(pages, inventory),
			),
			...labelled(
				`Scene not declared in ${docsPaths.captureScenes}`,
				findUnknownScenes(pages, scenes),
			),
			...labelled(
				`Screenshot missing from ${docsPaths.screenshotsDir}`,
				findMissingScreenshots(pages, docsPaths.screenshotsDir),
			),
		];
	};
}
