import { minimatch } from "minimatch";
import type { HighLevelTreeNode } from "../../../../../../../../../../../review/highLevel/types";
import { flattenHighLevelTree } from "../flattenHighLevelTree";

type HighLevelCollapseDefaults = {
	dirs: Set<string>;
	fileGlobs: Map<string, string>;
};

export function highLevelCollapseDefaults(
	tree: HighLevelTreeNode[],
	collapsedPaths: string[],
): HighLevelCollapseDefaults {
	const fileGlobs = new Map<string, string>();
	for (const file of flattenHighLevelTree(tree)) {
		const glob = collapsedPaths.find((pattern) =>
			minimatch(file.path, pattern),
		);
		if (glob) fileGlobs.set(file.path, glob);
	}
	return { dirs: collapsedDirs(tree, fileGlobs), fileGlobs };
}

function collapsedDirs(
	nodes: HighLevelTreeNode[],
	fileGlobs: Map<string, string>,
): Set<string> {
	const dirs = new Set<string>();
	for (const node of nodes) {
		if (node.kind === "file") continue;
		const files = flattenHighLevelTree(node.children);
		if (files.length > 0 && files.every((file) => fileGlobs.has(file.path)))
			dirs.add(node.path);
		for (const dir of collapsedDirs(node.children, fileGlobs)) dirs.add(dir);
	}
	return dirs;
}
