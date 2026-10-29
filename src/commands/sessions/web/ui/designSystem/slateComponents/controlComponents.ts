import { alpha, type Components, type Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";
import { tonalButtonVariants } from "./tonalButtonVariants";
import { tonalChipVariants } from "./tonalChipVariants";

export function controlComponents(tokens: ActiveTokens): Components<Theme> {
	const { color, radius } = tokens;
	return {
		MuiButton: {
			defaultProps: { disableElevation: true },
			styleOverrides: { root: { borderRadius: radius.sm } },
			variants: [
				...tonalButtonVariants(tokens),
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
		MuiButtonGroup: {
			defaultProps: { disableElevation: true },
			variants: [
				{
					props: { variant: "tonal" },
					style: {
						"& .MuiButtonGroup-middleButton, & .MuiButtonGroup-lastButton": {
							marginLeft: -1,
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
			variants: tonalChipVariants(tokens),
		},
	};
}
