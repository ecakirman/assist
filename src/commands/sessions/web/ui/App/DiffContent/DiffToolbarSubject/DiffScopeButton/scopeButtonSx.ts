import type { Theme } from "@mui/material/styles";

export const scopeButtonSx = {
	minWidth: 0,
	flex: "0 1 auto",
	height: 28,
	px: 1,
	textTransform: "none",
	fontSize: 13,
	fontWeight: 500,
	color: "text.primary",
	border: 1,
	borderColor: "divider",
	borderRadius: (t: Theme) => `${t.tokens.radius.sm}px`,
	bgcolor: "background.default",
	"&:hover": {
		bgcolor: "background.default",
		borderColor: "text.disabled",
	},
	"& .MuiButton-endIcon": { ml: 0.25, color: "text.disabled" },
} as const;
