import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export const docsPaths = {
	repoRoot,
	claudeDir: join(repoRoot, "claude"),
	appRoutes: join(
		repoRoot,
		"src/commands/sessions/web/ui/App/AppShell/AppRoutes.tsx",
	),
	pagesDir: join(repoRoot, "docs/guide/pages"),
	screenshotsDir: join(repoRoot, "docs/guide/screenshots"),
	stylesheet: join(repoRoot, "docs/guide/styles.css"),
	captureConfig: join(repoRoot, "docs/guide/capture/assist.yml"),
	captureScenes: join(repoRoot, "docs/guide/capture/scenes.json"),
	captureBin: join(repoRoot, "docs/guide/capture/bin"),
	distEntry: join(repoRoot, "dist/index.js"),
	outDir: join(repoRoot, ".docs-site"),
};
