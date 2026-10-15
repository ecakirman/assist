import { Tooltip, Typography } from "@mui/material";
import type { HighLevelTestCase } from "../../../../../../../../../../../../review/highLevel/types";
import {
	HIGH_LEVEL_STATUS_COLOURS,
	HIGH_LEVEL_STATUS_LETTERS,
	highLevelTreeNameSx,
} from "../../../highLevelTreeRowSx";

export function HighLevelTestChange({
	change,
}: {
	change: HighLevelTestCase["change"];
}) {
	if (!change) return null;
	return (
		<Tooltip title={change === "added" ? "New test" : "Edited test"}>
			<Typography
				component="span"
				aria-label={change}
				sx={{
					...highLevelTreeNameSx,
					flexShrink: 0,
					fontWeight: 700,
					color: HIGH_LEVEL_STATUS_COLOURS[change],
				}}
			>
				{HIGH_LEVEL_STATUS_LETTERS[change]}
			</Typography>
		</Tooltip>
	);
}
