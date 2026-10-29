import { alpha, type Components, type Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";

export function controlComponents({
	color,
	radius,
}: ActiveTokens): Components<Theme> {
	return {
		MuiButton: {
			defaultProps: { disableElevation: true },
			styleOverrides: { root: { borderRadius: radius.sm } },
			variants: [
				{
					props: { variant: "tonal" },
					style: {
						backgroundColor: color.raised,
						border: `1px solid ${color.line}`,
						color: color.text.primary,
						"&:hover": {
							backgroundColor: color.raised,
							borderColor: color.text.disabled,
						},
					},
				},
				{
					props: { variant: "outlined", color: "error" },
					style: {
						borderColor: alpha(color.error.main, 0.35),
						"&:hover": {
							borderColor: color.error.main,
							backgroundColor: alpha(color.error.main, 0.1),
						},
					},
				},
			],
		},
		MuiChip: {
			styleOverrides: {
				root: { fontWeight: 600, borderRadius: 999 },
				sizeSmall: { height: 22 },
				outlined: { borderColor: color.line },
			},
		},
	};
}
