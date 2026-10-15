import { Box, Typography } from "@mui/material";
import { highLevelTreeCountSx } from "./highLevelTreeRowSx";

export function HighLevelLineCounts({
	additions,
	deletions,
	inline = false,
}: {
	additions: number;
	deletions: number;
	inline?: boolean;
}) {
	return (
		<Box
			sx={{
				display: "flex",
				gap: 0.5,
				ml: inline ? 0 : "auto",
				pl: 1,
				flexShrink: 0,
			}}
		>
			<Typography
				component="span"
				sx={{ ...highLevelTreeCountSx, color: "success.main" }}
			>
				+{additions}
			</Typography>
			<Typography
				component="span"
				sx={{ ...highLevelTreeCountSx, color: "error.main" }}
			>
				−{deletions}
			</Typography>
		</Box>
	);
}
