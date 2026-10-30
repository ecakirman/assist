import type { Theme } from "@mui/material/styles";

const text = { fontFamily: "fontFamilyMono", fontSize: 12 } as const;

const classic = {
	root: text,
	group: { mb: 0.5 },
	heading: { opacity: 0.8 },
	foot: { mt: 0.5, opacity: 0.6 },
} as const;

const slate = {
	root: { ...text, display: "grid", gap: 1 },
	group: { display: "grid", gap: "2px" },
	heading: { color: (t: Theme) => t.tokens.color.onAppBar.secondary },
	foot: {
		pt: 0.75,
		opacity: 0.6,
		borderTop: "1px solid color-mix(in srgb, currentColor 18%, transparent)",
	},
} as const;

export const harnessRateLimitsTooltipSx = (isSlate: boolean) =>
	isSlate ? slate : classic;
