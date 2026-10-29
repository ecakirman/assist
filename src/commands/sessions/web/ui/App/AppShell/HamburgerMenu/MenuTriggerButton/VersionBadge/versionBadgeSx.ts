import type { Theme } from "@mui/material/styles";

const onAppBar = (t: Theme) => t.tokens.color.onAppBar;

export const versionBadgeSx = (ready: boolean) =>
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
		bgcolor: (t: Theme) => (ready ? onAppBar(t).active : "transparent"),
		transition: "opacity .2s ease, background-color .2s ease",
		"&:hover, &:focus-visible": {
			opacity: 1,
			bgcolor: (t: Theme) => onAppBar(t).hover,
		},
		"& .ready-dot": {
			width: 8,
			height: 8,
			borderRadius: "50%",
			bgcolor: (t: Theme) => onAppBar(t).dot,
			boxShadow: (t: Theme) => `0 0 0 2px ${onAppBar(t).dotRing}`,
		},
		"& .ready-count": { fontWeight: 500 },
	}) as const;
