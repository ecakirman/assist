import { minimatch } from "minimatch";

const globCharacters = /[*?[{]/;

export function highLevelGlobMatches(
	paths: string[],
	glob: string,
): Set<string> {
	const pattern = glob.trim();
	if (!pattern) return new Set();
	if (!globCharacters.test(pattern)) {
		const needle = pattern.toLowerCase();
		return new Set(paths.filter((path) => path.toLowerCase().includes(needle)));
	}
	return new Set(
		paths.filter((path) => minimatch(path, pattern, { matchBase: true })),
	);
}
