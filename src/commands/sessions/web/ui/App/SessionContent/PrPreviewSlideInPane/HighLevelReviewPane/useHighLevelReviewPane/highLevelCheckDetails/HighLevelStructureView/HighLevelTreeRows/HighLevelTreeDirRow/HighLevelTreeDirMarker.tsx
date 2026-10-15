import type { HighLevelTreeDir } from "../../../../../../../../../../../../review/highLevel/types";
import { flattenHighLevelTree } from "../../flattenHighLevelTree";
import { HighLevelTreeIgnoredChip } from "../HighLevelTreeIgnoredChip";
import { HighLevelTreeHiddenCount } from "./HighLevelTreeDirMarker/HighLevelTreeHiddenCount";

export function HighLevelTreeDirMarker({
	dir,
	collapsed,
	ignoredGlobs,
}: {
	dir: HighLevelTreeDir;
	collapsed: boolean;
	ignoredGlobs: string[] | undefined;
}) {
	if (ignoredGlobs)
		return (
			<HighLevelTreeIgnoredChip
				label={`${flattenHighLevelTree(dir.children).length} ignored`}
				globs={ignoredGlobs}
			/>
		);
	return collapsed ? <HighLevelTreeHiddenCount dir={dir} /> : null;
}
