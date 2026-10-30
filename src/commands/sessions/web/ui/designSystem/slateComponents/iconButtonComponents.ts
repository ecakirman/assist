import type { Components, Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";

const square = (side: number, icon: number) => ({
	width: side,
	height: side,
	"& .MuiSvgIcon-root": { fontSize: icon },
});

export function iconButtonComponents({
	color,
	radius,
}: ActiveTokens): Components<Theme> {
	return {
		MuiIconButton: {
			styleOverrides: {
				root: {
					...square(30, 18),
					padding: 0,
					borderRadius: radius.sm,
					"&:hover": { backgroundColor: color.raised },
				},
			},
			variants: [
				{ props: { size: "small" }, style: square(26, 16) },
				{
					props: { color: "default" },
					style: {
						color: color.text.secondary,
						"&:hover": { color: color.text.primary },
					},
				},
			],
		},
	};
}
