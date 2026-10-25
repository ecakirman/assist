import { existsSync, statSync, watch } from "node:fs";
import { join } from "node:path";
import { docsPaths } from "../docsPaths";

export type DocsChange = "css" | "page";

export function watchDocsSources(onChange: (change: DocsChange) => void): void {
	let timer: NodeJS.Timeout | undefined;
	let cssOnly = true;
	const mtimes = new Map<string, number>();
	const isRepeatedEvent = (path: string) => {
		const mtime = existsSync(path) ? statSync(path).mtimeMs : -1;
		const repeated = mtimes.get(path) === mtime;
		mtimes.set(path, mtime);
		return repeated;
	};
	const schedule = (path: string, isCss: boolean) => {
		if (isRepeatedEvent(path)) return;
		cssOnly &&= isCss;
		clearTimeout(timer);
		timer = setTimeout(() => {
			const change = cssOnly ? "css" : "page";
			cssOnly = true;
			onChange(change);
		}, 100);
	};
	const watchDir = (dir: string) =>
		watch(dir, { recursive: true }, (_, file) =>
			schedule(join(dir, file ?? ""), false),
		);
	watchDir(docsPaths.pagesDir);
	if (existsSync(docsPaths.screenshotsDir)) watchDir(docsPaths.screenshotsDir);
	watch(docsPaths.stylesheet, () => schedule(docsPaths.stylesheet, true));
}
