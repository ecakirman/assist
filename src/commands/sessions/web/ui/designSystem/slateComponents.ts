import { type Components, type Theme } from "@mui/material/styles";
import type { ActiveTokens } from "./DesignTokens";
import { overlayComponents } from "./slateComponents/overlayComponents";
import { controlComponents } from "./slateComponents/controlComponents";
import { tabComponents } from "./slateComponents/tabComponents";

export function slateComponents(tokens: ActiveTokens): Components<Theme> {
	const { appBar } = tokens.color;
	return {
		...overlayComponents(tokens),
		...controlComponents(tokens),
		...tabComponents(tokens),
		MuiPaper: {
			styleOverrides: {
				root: { backgroundImage: "none" },
				outlined: { borderColor: tokens.color.line },
			},
		},
		MuiAppBar: {
			defaultProps: { elevation: tokens.elevation.appBar },
			styleOverrides: {
				root: appBar && {
					backgroundColor: appBar.background,
					color: appBar.text,
					borderBottom: `1px solid ${tokens.color.line}`,
				},
			},
		},
	};
}
