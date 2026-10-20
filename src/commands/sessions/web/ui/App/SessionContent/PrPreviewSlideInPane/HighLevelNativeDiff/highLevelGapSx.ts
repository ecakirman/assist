import { alpha, type Theme } from "@mui/material/styles";

export const highLevelGapSx = (theme: Theme) => ({
	"& .high-level-gap td": {
		backgroundColor: alpha(theme.palette.primary.main, 0.08),
		borderBlock: `1px solid ${theme.palette.divider}`,
	},
	"& .high-level-gap-gutter": { textAlign: "center", p: 0 },
	"& .high-level-gap-content": {
		px: 1.5,
		color: "text.secondary",
		fontSize: 13,
		verticalAlign: "middle",
		whiteSpace: "nowrap",
	},
});
