import { useMemo } from "react";
import type { HighLevelTreeNode } from "../../../../../../../../../../review/highLevel/types";
import { useHighLevelCollapse } from "../useHighLevelCollapse";
import { highLevelCollapseDefaults } from "./useHighLevelStructureCollapse/highLevelCollapseDefaults";

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
	const dirs = useHighLevelCollapse(subject, defaults.dirs);
	const files = useHighLevelCollapse(`files:${subject}`, defaultFiles);
	return { dirs, files, fileGlobs: defaults.fileGlobs };
}
