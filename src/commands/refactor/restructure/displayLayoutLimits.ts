import chalk from "chalk";
import type { LayoutLimits } from "./checkLayoutLimits";
import { displayDeepChains } from "./displayDeepChains";
import { displayLongPaths } from "./displayLongPaths";

function pinSteps(apply: string): string[] {
	return [
		"Pin feature modules until this check passes:",
		"1. On each deep chain or long path, pick the highest module that is a feature boundary: a route, view, page, panel, dialog or card. Never a hook, utility, style file or helper.",
		"2. Add it to restructure.pin in assist.yml yourself (basename without extension). One pin at a time: one feature pin often fixes several chains or paths.",
		"3. Re-run this command. Repeat until the plan is within the limits.",
		"4. If a chain or path has no sensible feature boundary, stop and report it.",
		`Then run \`${apply}\`.`,
	];
}

export function exceedsLayoutLimits(limits: LayoutLimits): boolean {
	return limits.chains.length > 0 || limits.longPaths.length > 0;
}

export function displayLayoutLimits(limits: LayoutLimits, apply: string): void {
	if (!exceedsLayoutLimits(limits)) return;
	displayDeepChains(limits.chains, limits.maxDepth);
	displayLongPaths(limits.longPaths, limits.maxPathLength);
	console.log("");
	for (const line of pinSteps(apply)) console.log(chalk.yellow(line));
}
