import type { Theme } from "@mui/material/styles";
import { chromeColors } from "../../../../../designSystem/chromeColors";

const statusBar = (t: Theme) => t.tokens.color.statusBar;

const onStatusBarSx = {
	height: 22,
	py: 0,
	borderRadius: 1,
	fontSize: "inherit",
	opacity: 1,
	"&:hover, &:focus-visible": {
		bgcolor: (t: Theme) => statusBar(t)?.hover,
		color: (t: Theme) => statusBar(t)?.hoverText,
	},
	"& .ready-count": {
		fontWeight: 500,
		color: (t: Theme) => statusBar(t)?.readyText,
	},
} as const;

export const versionBadgeSx = (ready: boolean, onStatusBar = false) =>
	({
		display: "inline-flex",
		alignItems: "center",
		gap: 0.75,
		px: 1,
		py: 0.25,
		borderRadius: 999,
		fontSize: 12,
		lineHeight: 1.5,
		color: "inherit",
		opacity: ready ? 1 : 0.55,
		bgcolor: (t: Theme) => (ready ? chromeColors(t).active : "transparent"),
		transition: "opacity .2s ease, background-color .2s ease, color .2s ease",
		"&:hover, &:focus-visible": {
			opacity: 1,
			bgcolor: (t: Theme) => chromeColors(t).hover,
		},
		"& .ready-dot": {
			width: onStatusBar ? 6 : 8,
			height: onStatusBar ? 6 : 8,
			borderRadius: "50%",
			bgcolor: (t: Theme) => chromeColors(t).dot,
			boxShadow: (t: Theme) =>
				`0 0 0 ${onStatusBar ? 3 : 2}px ${chromeColors(t).dotRing}`,
		},
		"& .ready-count": { fontWeight: 500 },
		...(onStatusBar && onStatusBarSx),
	}) as const;
