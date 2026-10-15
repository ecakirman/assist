import type { HighLevelTreeNode } from "../../../../../../../../review/highLevel/types";

export function flattenHighLevelDirs(nodes: HighLevelTreeNode[]): string[] {
	return nodes.flatMap((node) =>
		node.kind === "file"
			? []
			: [node.path, ...flattenHighLevelDirs(node.children)],
	);
}
