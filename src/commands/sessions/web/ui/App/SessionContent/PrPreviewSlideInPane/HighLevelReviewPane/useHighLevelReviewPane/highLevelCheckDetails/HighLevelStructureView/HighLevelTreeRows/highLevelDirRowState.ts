import type { HighLevelTreeDir } from "../../../../../../../../../../../review/highLevel/types";
import { flattenHighLevelTree } from "../flattenHighLevelTree";
import { highLevelIgnoredGlobs } from "./highLevelDirRowState/highLevelIgnoredGlobs";
import type { HighLevelTreeRowsProps } from "./HighLevelTreeRowsProps";

export function highLevelDirRowState(
	dir: HighLevelTreeDir,
	props: HighLevelTreeRowsProps,
) {
	const collapsed = props.collapsed.has(dir.path);
	if (!collapsed) return { collapsed, matched: false, ignoredGlobs: undefined };
	return {
		collapsed,
		matched: flattenHighLevelTree(dir.children).some((file) =>
			props.matches.has(file.path),
		),
		ignoredGlobs: highLevelIgnoredGlobs(dir, props.fileGlobs),
	};
}
