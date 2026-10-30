import type { Theme } from "@mui/material/styles";

const classicSx = {
	minWidth: 0,
	flex: "0 1 auto",
	height: 28,
	px: 0.75,
	textTransform: "none",
	fontSize: 13,
	fontWeight: 500,
	color: "text.primary",
	"& .MuiButton-endIcon": { ml: 0.25, color: "text.disabled" },
} as const;

const slateSx = (t: Theme) =>
	t.design === "slate"
		? {
				px: 1,
				border: 1,
				borderColor: "divider",
				borderRadius: `${t.tokens.radius.sm}px`,
				bgcolor: "background.default",
				"&:hover": {
					bgcolor: "background.default",
					borderColor: "text.disabled",
				},
			}
		: {};

export const scopeButtonSx = [classicSx, slateSx];
