import type { Components, Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";

export function switchComponents({ color }: ActiveTokens): Components<Theme> {
	const pill = {
		width: 34,
		height: 20,
		padding: 0,
		"& .MuiSwitch-switchBase": {
			padding: 2,
			color: color.text.secondary,
			"&.Mui-checked": {
				transform: "translateX(14px)",
				color: color.primary.contrastText,
			},
			"&.Mui-checked + .MuiSwitch-track": {
				backgroundColor: color.primary.main,
				opacity: 1,
			},
		},
		"& .MuiSwitch-thumb": { width: 16, height: 16, boxShadow: "none" },
		"& .MuiSwitch-track": {
			borderRadius: 10,
			backgroundColor: color.line,
			opacity: 1,
		},
	};
	return {
		MuiSwitch: {
			styleOverrides: { root: pill },
		},
		MuiFormControlLabel: {
			styleOverrides: {
				root: { "&:has(.MuiSwitch-root)": { marginLeft: 0, gap: 8 } },
			},
		},
	};
}
