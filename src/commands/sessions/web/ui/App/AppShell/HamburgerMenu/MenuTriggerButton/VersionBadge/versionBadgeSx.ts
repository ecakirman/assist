import type { Theme } from "@mui/material/styles";
import { chromeColors } from "../../../../../designSystem/chromeColors";

export const versionBadgeSx = (ready: boolean) =>
	({
		display: "inline-flex",
		alignItems: "center",
		gap: 0.75,
		px: 1,
		py: 0,
		height: 22,
		borderRadius: 1,
		fontSize: "inherit",
		lineHeight: 1.5,
		color: "inherit",
		opacity: 1,
		bgcolor: (t: Theme) => (ready ? chromeColors(t).active : "transparent"),
		transition: "opacity .2s ease, background-color .2s ease, color .2s ease",
		"&:hover, &:focus-visible": {
			bgcolor: (t: Theme) => chromeColors(t).hover,
			color: (t: Theme) => chromeColors(t).hoverText,
		},
		"& .ready-dot": {
			width: 6,
			height: 6,
			borderRadius: "50%",
			bgcolor: (t: Theme) => chromeColors(t).dot,
			boxShadow: (t: Theme) => `0 0 0 3px ${chromeColors(t).dotRing}`,
		},
		"& .ready-count": {
			fontWeight: 500,
			color: (t: Theme) => chromeColors(t).readyText,
		},
	}) as const;
