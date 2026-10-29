import type { ActiveTokens } from "../DesignTokens";
import { tintedColors, tintedStyle } from "./tintedStyle";

export function tonalChipVariants({ color }: ActiveTokens) {
	return [
		{
			props: { variant: "tonal" as const },
			style: {
				backgroundColor: "transparent",
				border: `1px solid ${color.line}`,
				color: color.text.secondary,
			},
		},
		...tintedColors.map((name) => ({
			props: { variant: "tonal" as const, color: name },
			style: {
				...tintedStyle(color[name].main, 0.14),
				borderColor: "transparent",
			},
		})),
	];
}
