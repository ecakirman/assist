import { alpha, type Theme } from "@mui/material/styles";

export const highLevelGapSx = (theme: Theme) => ({
	"& .high-level-gap td": {
		backgroundColor: alpha(theme.palette.primary.main, 0.08),
		borderBlock: `1px solid ${theme.palette.divider}`,
	},
	"& .high-level-gap-gutter": { p: 0 },
	"& .high-level-gap-buttons": { display: "flex", flexDirection: "column" },
	"& .high-level-gap-button": {
		width: "100%",
		minWidth: 88,
		height: 26,
		color: "text.secondary",
		transition: "background-color 0.2s ease, color 0.2s ease",
		"& + .high-level-gap-button": {
			borderTop: `1px solid ${theme.palette.divider}`,
		},
		"&:hover": {
			backgroundColor: alpha(theme.palette.primary.main, 0.2),
			color: "primary.main",
		},
		"&.Mui-disabled": { color: "text.disabled" },
	},
	"& .high-level-gap-content": {
		px: 1.5,
		color: "text.secondary",
		fontSize: 13,
		verticalAlign: "middle",
		whiteSpace: "nowrap",
	},
});
