import type { Components, Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";

export function toggleButtonComponents({
	color,
	radius,
}: ActiveTokens): Components<Theme> {
	return {
		MuiToggleButtonGroup: {
			styleOverrides: {
				root: {
					padding: 2,
					gap: 2,
					border: `1px solid ${color.line}`,
					borderRadius: radius.sm,
					backgroundColor: color.background,
				},
				grouped: { margin: 0, border: 0, borderRadius: 4 },
			},
		},
		MuiToggleButton: {
			styleOverrides: {
				root: {
					padding: "3px 8px",
					border: 0,
					borderRadius: 4,
					fontSize: 13,
					fontWeight: 500,
					lineHeight: "18px",
					textTransform: "none",
					color: color.text.secondary,
					"& .MuiSvgIcon-root": { fontSize: 16 },
					"&:hover": {
						backgroundColor: "transparent",
						color: color.text.primary,
					},
					"&.Mui-selected, &.Mui-selected:hover": {
						backgroundColor: color.raised,
						color: color.text.primary,
					},
				},
			},
		},
	};
}
