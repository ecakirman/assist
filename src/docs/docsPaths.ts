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
	outDir: join(repoRoot, ".docs-site"),
};
