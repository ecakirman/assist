import type { HighLevelTreeNode } from "../../../../../../review/highLevel/types";

export type HighLevelDiffCounts = { open: number; collapsed: number };

export function countHighLevelDiffs(
	nodes: HighLevelTreeNode[],
	collapsedDirs: ReadonlySet<string>,
	collapsedFiles: ReadonlySet<string>,
	hidden = false,
): HighLevelDiffCounts {
	const counts = { open: 0, collapsed: 0 };
	for (const node of nodes) {
		if (node.kind === "file") {
			if (hidden || collapsedFiles.has(node.path)) counts.collapsed++;
			else counts.open++;
			continue;
		}
		const inner = countHighLevelDiffs(
			node.children,
			collapsedDirs,
			collapsedFiles,
			hidden || collapsedDirs.has(node.path),
		);
		counts.open += inner.open;
		counts.collapsed += inner.collapsed;
	}
	return counts;
}
