import type { Theme } from "@mui/material/styles";

export const harnessRateLimitsTooltipSx = {
	root: {
		fontFamily: "fontFamilyMono",
		fontSize: 12,
		display: "grid",
		gap: 1,
	},
	group: { display: "grid", gap: "2px" },
	heading: { color: (t: Theme) => t.tokens.color.onAppBar.secondary },
	foot: {
		pt: 0.75,
		opacity: 0.6,
		borderTop: "1px solid color-mix(in srgb, currentColor 18%, transparent)",
	},
} as const;
