import type { HighLevelCriticalDiff } from "../../../../../../../../../../review/highLevel/types";
import { useHighLevelCollapse } from "../../../../useHighLevelCollapse";

export function useHighLevelCriticalCollapse(
	subject: string,
	diffs: HighLevelCriticalDiff[],
) {
	const { collapsed, onToggle, onSet } = useHighLevelCollapse(
		`critical:${subject}`,
	);
	const paths = diffs.map((diff) => diff.path);
	const collapsedCount = paths.filter((path) => collapsed.has(path)).length;
	return {
		collapsed,
		onToggle,
		bulk: {
			open: paths.length - collapsedCount,
			collapsed: collapsedCount,
			expandAll: () => onSet(paths, false),
			collapseAll: () => onSet(paths, true),
		},
	};
}
