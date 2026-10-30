import type { Components, Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";
import { menuComponents } from "./menuComponents";

export function overlayComponents(tokens: ActiveTokens): Components<Theme> {
	const { color, radius, elevation, type } = tokens;
	const frame = { border: `1px solid ${color.line}` };
	return {
		...menuComponents(tokens),
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					...frame,
					backgroundColor: color.overlay.background,
					color: color.overlay.text,
					borderRadius: radius.md,
					boxShadow: elevation.overlay,
					fontSize: `${type.scale.caption / 16}rem`,
					padding: "6px 10px",
				},
				arrow: { color: color.overlay.background },
			},
		},
		MuiPopover: {
			styleOverrides: {
				paper: { ...frame, boxShadow: elevation.overlay },
			},
		},
		MuiBackdrop: {
			styleOverrides: {
				root: {
					"&:not(.MuiBackdrop-invisible)": {
						backgroundColor: color.scrim,
						backdropFilter: "blur(2px)",
					},
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					...frame,
					backgroundColor: color.surface,
					borderRadius: radius.md + 4,
					boxShadow: elevation.dialog,
				},
			},
		},
	};
}
