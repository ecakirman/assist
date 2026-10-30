import type { Theme } from "@mui/material/styles";

export const rateLimitTooltipRowSx = {
	row: {
		display: "grid",
		gridTemplateColumns: "2.5ch 4ch 1ch 4ch 1ch 4ch auto",
		alignItems: "baseline",
		gap: 0.75,
		fontVariantNumeric: "tabular-nums",
	},
	pctWeight: 500,
	note: {
		pl: 0.75,
		color: (t: Theme) => t.tokens.color.onAppBar.secondary,
	},
};
