import { existsSync } from "node:fs";
import { join } from "node:path";
import { docsPaths } from "./docsPaths";

export function isCaptured(file: string): boolean {
	return existsSync(join(docsPaths.screenshotsDir, file));
}
