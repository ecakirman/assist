import { type DeepChain, findDeepChains } from "./findDeepChains";
import { findLongPaths, type LongPath } from "./findLongPaths";
import type { RestructurePlan } from "./types";

export type LayoutLimits = {
	maxDepth: number;
	chains: DeepChain[];
	maxPathLength: number;
	longPaths: LongPath[];
};

type LimitOptions = {
	maxDepth: number;
	maxPathLength: number;
	repoRoot: string;
};

export function checkLayoutLimits(
	plan: RestructurePlan,
	{ maxDepth, maxPathLength, repoRoot }: LimitOptions,
): LayoutLimits {
	return {
		maxDepth,
		chains: findDeepChains(plan.targets.values(), plan.scopeRoot, maxDepth),
		maxPathLength,
		longPaths: findLongPaths(plan.targets.values(), repoRoot, maxPathLength),
	};
}
