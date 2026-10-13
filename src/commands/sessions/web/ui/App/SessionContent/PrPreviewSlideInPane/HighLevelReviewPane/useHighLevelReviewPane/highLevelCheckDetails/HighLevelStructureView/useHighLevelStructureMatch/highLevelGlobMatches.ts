import { minimatch } from "minimatch";

export function highLevelGlobMatches(
	paths: string[],
	glob: string,
): Set<string> {
	const pattern = glob.trim();
	if (!pattern) return new Set();
	return new Set(
		paths.filter((path) => minimatch(path, pattern, { matchBase: true })),
	);
}
