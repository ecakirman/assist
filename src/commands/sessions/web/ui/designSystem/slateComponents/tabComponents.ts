import type { Components, Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";

const tint = (percent: number) =>
	`color-mix(in srgb, currentColor ${percent}%, transparent)`;

export function tabComponents({ radius }: ActiveTokens): Components<Theme> {
	return {
		MuiTabs: {
			styleOverrides: {
				root: { minHeight: 40, alignItems: "center" },
				list: { gap: 2 },
				indicator: { display: "none" },
			},
		},
		MuiTab: {
			styleOverrides: {
				root: {
					minHeight: 30,
					padding: "6px 10px",
					borderRadius: radius.sm,
					textTransform: "none",
					fontWeight: 500,
					"&:hover": { backgroundColor: tint(8) },
					"&.Mui-selected": {
						backgroundColor: tint(12),
						boxShadow: `inset 0 0 0 1px ${tint(18)}`,
					},
				},
			},
		},
	};
}
