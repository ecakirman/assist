import * as path from "node:path";
import { readVerifyScripts } from "../../../shared/readPackageJson";
import type { VerifyEntry } from "./VerifyEntry";

export function getRepoRootEntries(
	baseDir: string,
	roots: string[],
): VerifyEntry[] {
	return readVerifyScripts(path.join(baseDir, "package.json")).map(
		(script) => ({
			name: script,
			fullCommand: `npm run ${script}`,
			cwd: baseDir,
			outsideRoots: roots,
		}),
	);
}
