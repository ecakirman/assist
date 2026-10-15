import path from "node:path";

export type LongPath = { path: string; length: number };

export function findLongPaths(
	targets: Iterable<string>,
	repoRoot: string,
	maxPathLength: number,
): LongPath[] {
	return [...targets]
		.map((t) => path.relative(repoRoot, t).split(path.sep).join("/"))
		.filter((p) => p.length > maxPathLength)
		.map((p) => ({ path: p, length: p.length }))
		.sort((a, b) => b.length - a.length || a.path.localeCompare(b.path));
}
