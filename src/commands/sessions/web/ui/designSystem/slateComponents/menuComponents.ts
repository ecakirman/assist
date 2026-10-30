import type { Components, Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";

export function menuComponents({
	color,
	radius,
}: ActiveTokens): Components<Theme> {
	return {
		MuiMenu: {
			styleOverrides: {
				paper: { borderRadius: radius.md },
				list: { padding: 4 },
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					minHeight: 30,
					padding: "5px 10px",
					borderRadius: 4,
					fontSize: 13,
					"&:hover": { backgroundColor: color.raised },
					"& .MuiListItemIcon-root": { minWidth: 28 },
					"& .MuiSvgIcon-root": { fontSize: 16 },
					"& .MuiListItemText-primary": { fontSize: 13 },
				},
			},
		},
	};
}
