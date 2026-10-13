import { Box, Typography } from "@mui/material";
import type { HighLevelTreeDir } from "../../../../../../../../../../../review/highLevel/types";
import { HighLevelLineCounts } from "../../HighLevelLineCounts";
import {
	highLevelButtonResetSx,
	highLevelTintedRowSx,
	highLevelTreeNameSx,
	highLevelTreeRowButtonSx,
	highLevelTreeRowSx,
} from "../../highLevelTreeRowSx";
import { HighLevelTreeDirIcons } from "./HighLevelTreeDirRow/HighLevelTreeDirIcons";
import { HighLevelTreeHiddenCount } from "./HighLevelTreeDirRow/HighLevelTreeHiddenCount";

export function HighLevelTreeDirRow({
	dir,
	collapsed,
	indent,
	onToggle,
}: {
	dir: HighLevelTreeDir;
	collapsed: boolean;
	indent: string;
	onToggle: () => void;
}) {
	return (
		<Box
			component="button"
			type="button"
			onClick={onToggle}
			aria-expanded={!collapsed}
			aria-label={dir.path}
			sx={[
				{
					...highLevelTreeRowSx,
					...highLevelTreeRowButtonSx,
					pl: indent,
					...highLevelButtonResetSx,
				},
				collapsed && highLevelTintedRowSx,
			]}
		>
			<HighLevelTreeDirIcons collapsed={collapsed} />
			<Typography
				component="span"
				sx={{
					...highLevelTreeNameSx,
					fontWeight: 600,
					color: collapsed ? "primary.main" : undefined,
				}}
			>
				{dir.name}
			</Typography>
			{collapsed && <HighLevelTreeHiddenCount dir={dir} />}
			<HighLevelLineCounts
				additions={dir.additions}
				deletions={dir.deletions}
				inline
			/>
		</Box>
	);
}
