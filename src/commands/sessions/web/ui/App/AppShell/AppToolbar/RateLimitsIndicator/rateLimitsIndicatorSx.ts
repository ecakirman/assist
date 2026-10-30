import type { Theme } from "@mui/material/styles";

const toolbarSx = {
	display: "flex",
	alignItems: "center",
	ml: 2,
	fontFamily: "fontFamilyMono",
	fontSize: 13,
} as const;

const statusBarSx = {
	display: "flex",
	alignItems: "center",
	height: 22,
	px: 1,
	borderRadius: 1,
	fontSize: "inherit",
	"&:hover, &:focus-visible": {
		bgcolor: (t: Theme) => t.tokens.color.statusBar?.hover,
		color: (t: Theme) => t.tokens.color.statusBar?.hoverText,
	},
} as const;

export const statusBarTooltipSlotProps = {
	tooltip: { sx: { p: "10px 12px", minWidth: 300, maxWidth: "none" } },
};

export const rateLimitsIndicatorSx = (onStatusBar: boolean) =>
	onStatusBar ? statusBarSx : toolbarSx;
