import type { Components, Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";
import { tonalChipVariants } from "./tonalChipVariants";

export function chipComponents(tokens: ActiveTokens): Components<Theme> {
	return {
		MuiChip: {
			styleOverrides: {
				root: { height: 20, fontSize: 11, fontWeight: 600, borderRadius: 999 },
				sizeSmall: { height: 20, "& .MuiChip-label": { padding: "0 7px" } },
				label: { padding: "0 8px" },
				icon: { fontSize: 14, marginLeft: 6, marginRight: -2 },
				deleteIcon: { fontSize: 14, marginLeft: -2, marginRight: 4 },
				outlined: { borderColor: tokens.color.line },
			},
			variants: [
				...tonalChipVariants(tokens, "tonal"),
				...tonalChipVariants(tokens, "filled"),
			],
		},
	};
}
