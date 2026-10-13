import { Tooltip, Typography } from "@mui/material";
import type { HighLevelTreeFile } from "../../../../../../../../../../../../../review/highLevel/types";
import {
	HIGH_LEVEL_STATUS_COLOURS,
	HIGH_LEVEL_STATUS_LETTERS,
	highLevelTreeNameSx,
} from "../../../../highLevelTreeRowSx";

export function HighLevelTreeFileLabel({ file }: { file: HighLevelTreeFile }) {
	return (
		<>
			<Tooltip title={file.status}>
				<Typography
					component="span"
					sx={{ ...highLevelTreeNameSx, flexShrink: 0, fontWeight: 700 }}
					color={HIGH_LEVEL_STATUS_COLOURS[file.status]}
				>
					{HIGH_LEVEL_STATUS_LETTERS[file.status]}
				</Typography>
			</Tooltip>
			<Typography component="span" sx={highLevelTreeNameSx} title={file.path}>
				{file.name}
			</Typography>
		</>
	);
}
