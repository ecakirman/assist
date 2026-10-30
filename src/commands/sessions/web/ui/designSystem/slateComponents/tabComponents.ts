import type { Components, Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";

const tint = (percent: number) =>
	`color-mix(in srgb, currentColor ${percent}%, transparent)`;

const onAppBarTab = {
	".MuiAppBar-root &": {
		color: "inherit",
		"&:hover": { backgroundColor: tint(8) },
		"&.Mui-selected": {
			color: "inherit",
			backgroundColor: tint(12),
			boxShadow: `inset 0 0 0 1px ${tint(18)}`,
		},
	},
};

export function tabComponents({
	color,
	radius,
}: ActiveTokens): Components<Theme> {
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
					fontSize: 13,
					fontWeight: 500,
					opacity: 1,
					color: color.text.secondary,
					"&:hover": {
						backgroundColor: color.raised,
						color: color.text.primary,
					},
					"&.Mui-selected": {
						color: color.text.primary,
						backgroundColor: color.raised,
						boxShadow: `inset 0 0 0 1px ${color.line}`,
					},
					...(!color.appBar && onAppBarTab),
				},
			},
		},
	};
}
