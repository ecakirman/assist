import { alpha } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";
import { tintedColors, tintedStyle } from "./tintedStyle";

export function tonalChipVariants(
	{ color }: ActiveTokens,
	variant: "tonal" | "filled",
) {
	return [
		{
			props: { variant, color: "default" as const },
			style: {
				backgroundColor: "transparent",
				border: `1px solid ${color.line}`,
				color: color.text.secondary,
				"&.MuiChip-clickable:hover": { backgroundColor: color.raised },
			},
		},
		...tintedColors.map((name) => ({
			props: { variant, color: name },
			style: {
				...tintedStyle(color[name].main, 0.14),
				borderColor: "transparent",
				"& .MuiChip-deleteIcon": {
					color: alpha(color[name].main, 0.7),
					"&:hover, &:active": { color: color[name].main },
				},
				"&.MuiChip-clickable:hover": {
					backgroundColor: alpha(color[name].main, 0.22),
				},
			},
		})),
	];
}
