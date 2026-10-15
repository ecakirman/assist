import { Box, Typography } from "@mui/material";
import type { HighLevelTreeDir } from "../../../../../../../../review/highLevel/types";
import { HighLevelLineCounts } from "../../HighLevelLineCounts";
import { HighLevelTreeDirIcons } from "./HighLevelTreeDirRow/HighLevelTreeDirIcons";
import { HighLevelTreeDirMarker } from "./HighLevelTreeDirRow/HighLevelTreeDirMarker";
import {
	highLevelTreeDirNameSx,
	highLevelTreeDirRowSx,
} from "./HighLevelTreeDirRow/highLevelTreeDirRowSx";

export function HighLevelTreeDirRow({
	dir,
	collapsed,
	matched,
	ignoredGlobs,
	indent,
	onToggle,
}: {
	dir: HighLevelTreeDir;
	collapsed: boolean;
	matched: boolean;
	ignoredGlobs: string[] | undefined;
	indent: string;
	onToggle: () => void;
}) {
	const ignored = ignoredGlobs !== undefined;
	return (
		<Box
			component="button"
			type="button"
			onClick={onToggle}
			aria-expanded={!collapsed}
			aria-label={dir.path}
			data-matched={matched || undefined}
			sx={highLevelTreeDirRowSx(indent, matched)}
		>
			<HighLevelTreeDirIcons collapsed={collapsed} ignored={ignored} />
			<Typography
				component="span"
				sx={highLevelTreeDirNameSx(collapsed, ignored)}
			>
				{dir.name}
			</Typography>
			<HighLevelTreeDirMarker
				dir={dir}
				collapsed={collapsed}
				ignoredGlobs={ignoredGlobs}
			/>
			<HighLevelLineCounts
				additions={dir.additions}
				deletions={dir.deletions}
				inline
			/>
		</Box>
	);
}
