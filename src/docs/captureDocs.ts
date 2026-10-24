import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { parseArgs } from "node:util";
import { captureScreenshots } from "./capture/captureScreenshots";
import { withCaptureEnvironment } from "./capture/withCaptureEnvironment";
import { docsPaths } from "./docsPaths";
import { loadDocsPages } from "./loadDocsPages";

function selectScreenshots(only: string[]) {
	const screenshots = loadDocsPages(docsPaths.pagesDir).flatMap((page) =>
		page.sections.flatMap((section) => section.screenshots ?? []),
	);
	return only.length === 0
		? screenshots
		: screenshots.filter((screenshot) => only.includes(screenshot.file));
}

function build(): void {
	const result = spawnSync("npm", ["run", "build"], {
		cwd: docsPaths.repoRoot,
		stdio: "inherit",
		shell: process.platform === "win32",
	});
	if (result.status !== 0) process.exit(result.status ?? 1);
}

export async function captureDocs(argv: string[]): Promise<void> {
	const { values, positionals } = parseArgs({
		args: argv,
		allowPositionals: true,
		options: {
			"skip-build": { type: "boolean", default: false },
			"keep-home": { type: "boolean", default: false },
		},
	});
	const screenshots = selectScreenshots(positionals);
	if (screenshots.length === 0) {
		console.log("No screenshots declared to capture");
		return;
	}
	if (!values["skip-build"]) build();
	mkdirSync(docsPaths.screenshotsDir, { recursive: true });

	await withCaptureEnvironment(values["keep-home"], ({ capture, url }) =>
		captureScreenshots(capture, url, screenshots),
	);
}

captureDocs(process.argv.slice(2)).catch((error: Error) => {
	console.error(error.message);
	process.exit(1);
});
