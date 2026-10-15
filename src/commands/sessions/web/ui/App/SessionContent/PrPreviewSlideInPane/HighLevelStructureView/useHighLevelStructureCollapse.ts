import { useMemo } from "react";
import type { HighLevelTreeNode } from "../../../../../../../review/highLevel/types";
import { useHighLevelCollapse } from "../useHighLevelCollapse";
import { flattenHighLevelTree } from "./flattenHighLevelTree";
import { flattenHighLevelDirs } from "./useHighLevelStructureCollapse/flattenHighLevelDirs";
import { highLevelCollapseDefaults } from "./useHighLevelStructureCollapse/highLevelCollapseDefaults";
import { highLevelStructureBulk } from "./highLevelStructureBulk";

export function useHighLevelStructureCollapse(
	subject: string,
	tree: HighLevelTreeNode[],
	collapsedPaths: string[],
) {
	const defaults = useMemo(
		() => highLevelCollapseDefaults(tree, collapsedPaths),
		[tree, collapsedPaths],
	);
	const defaultFiles = useMemo(
		() => new Set(defaults.fileGlobs.keys()),
		[defaults],
	);
	const filePaths = useMemo(
		() => flattenHighLevelTree(tree).map((file) => file.path),
		[tree],
	);
	const dirPaths = useMemo(() => flattenHighLevelDirs(tree), [tree]);
	const dirs = useHighLevelCollapse(subject, defaults.dirs);
	const files = useHighLevelCollapse(`files:${subject}`, defaultFiles);
	const bulk = highLevelStructureBulk(dirs, files, dirPaths, filePaths);

	return { dirs, files, fileGlobs: defaults.fileGlobs, filePaths, bulk };
}
