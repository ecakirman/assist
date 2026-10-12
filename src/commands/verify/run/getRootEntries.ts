import * as path from "node:path";
import { readVerifyScripts } from "../../../shared/readPackageJson";
import type { VerifyEntry } from "./VerifyEntry";

export function getRootEntries(
	baseDir: string,
	roots: string[],
): VerifyEntry[] {
	return roots.flatMap((root) => {
		const cwd = path.resolve(baseDir, root);
		return readVerifyScripts(path.join(cwd, "package.json")).map((script) => ({
			name: `${root}:${script}`,
			fullCommand: `npm run ${script}`,
			cwd,
			filter: `${root}/**`,
		}));
	});
}
