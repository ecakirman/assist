import chalk from "chalk";
import type { LongPath } from "./findLongPaths";

export function displayLongPaths(
	longPaths: LongPath[],
	maxPathLength: number,
): void {
	if (longPaths.length === 0) return;
	console.log(
		chalk.red(
			`\nPlan exceeds restructure.maxPathLength ${maxPathLength}: ${longPaths.length} repo-relative path(s) longer.`,
		),
	);
	for (const { path, length } of longPaths)
		console.log(`  ${path}  [${length}]`);
}
