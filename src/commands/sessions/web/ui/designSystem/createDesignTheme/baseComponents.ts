import type { Components, Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";

export function baseComponents(tokens: ActiveTokens): Components<Theme> {
	return {
		MuiButtonBase: {
			styleOverrides: {
				root: {
					cursor: "pointer",
					"&.Mui-disabled": { cursor: "default" },
				},
			},
		},
		MuiLink: {
			styleOverrides: {
				root: { cursor: "pointer" },
			},
		},
		MuiAppBar: {
			defaultProps: { elevation: tokens.elevation.appBar },
		},
	};
}
