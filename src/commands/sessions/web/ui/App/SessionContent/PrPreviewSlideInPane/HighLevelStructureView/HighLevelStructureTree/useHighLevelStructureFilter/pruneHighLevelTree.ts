import type { HighLevelTreeNode } from "../../../../../../../../../review/highLevel/types";

export function pruneHighLevelTree(
	nodes: HighLevelTreeNode[],
	matches: Set<string>,
): HighLevelTreeNode[] {
	return nodes.flatMap<HighLevelTreeNode>((node) => {
		if (node.kind === "file") return matches.has(node.path) ? [node] : [];
		const children = pruneHighLevelTree(node.children, matches);
		return children.length > 0 ? [{ ...node, children }] : [];
	});
}
