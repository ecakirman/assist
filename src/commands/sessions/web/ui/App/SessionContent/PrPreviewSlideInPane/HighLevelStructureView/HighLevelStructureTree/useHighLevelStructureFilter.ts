import { useMemo } from "react";
import type { HighLevelTreeNode } from "../../../../../../../../review/highLevel/types";
import { pruneHighLevelTree } from "./useHighLevelStructureFilter/pruneHighLevelTree";

const NO_COLLAPSED_DIRS = new Set<string>();

export function useHighLevelStructureFilter(
	tree: HighLevelTreeNode[],
	glob: string,
	matches: Set<string>,
	collapsedDirs: Set<string>,
) {
	const filtering = glob.trim() !== "";
	const nodes = useMemo(
		() => (filtering ? pruneHighLevelTree(tree, matches) : tree),
		[filtering, tree, matches],
	);
	return {
		nodes,
		collapsedDirs: filtering ? NO_COLLAPSED_DIRS : collapsedDirs,
		noMatches: filtering && nodes.length === 0,
	};
}
