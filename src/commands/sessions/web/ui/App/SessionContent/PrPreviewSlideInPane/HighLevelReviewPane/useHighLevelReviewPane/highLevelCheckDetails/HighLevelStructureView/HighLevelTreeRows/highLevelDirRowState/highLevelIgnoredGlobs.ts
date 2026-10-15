import type { HighLevelTreeDir } from "../../../../../../../../../../../../review/highLevel/types";
import { flattenHighLevelTree } from "../../flattenHighLevelTree";

export function highLevelIgnoredGlobs(
	dir: HighLevelTreeDir,
	fileGlobs: Map<string, string>,
): string[] | undefined {
	const globs = flattenHighLevelTree(dir.children).map((file) =>
		fileGlobs.get(file.path),
	);
	if (globs.length === 0 || globs.some((glob) => glob === undefined))
		return undefined;
	return [...new Set(globs as string[])];
}
