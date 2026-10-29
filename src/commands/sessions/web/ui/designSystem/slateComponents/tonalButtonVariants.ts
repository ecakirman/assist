import type { ActiveTokens } from "../DesignTokens";
import { tintedColors, tintedStyle } from "./tintedStyle";

export function tonalButtonVariants({ color }: ActiveTokens) {
	return [
		{
			props: { variant: "tonal" as const },
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
		...tintedColors
			.filter((name) => name !== "primary")
			.map((name) => ({
				props: { variant: "tonal" as const, color: name },
				style: {
					...tintedStyle(color[name].main, 0.16),
					"&:hover": tintedStyle(color[name].main, 0.24),
				},
			})),
	];
}
