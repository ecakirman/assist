import type { Components, Theme } from "@mui/material/styles";
import type { ActiveTokens } from "../DesignTokens";

const outline = ".MuiOutlinedInput-notchedOutline";

export function inputComponents({
	color,
	radius,
}: ActiveTokens): Components<Theme> {
	return {
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					backgroundColor: color.background,
					borderRadius: radius.sm,
					fontSize: 13,
					color: color.text.primary,
					[`& ${outline}`]: { borderColor: color.line },
					[`&:hover ${outline}`]: { borderColor: color.text.disabled },
					[`&.Mui-focused ${outline}`]: {
						borderColor: color.primary.main,
						borderWidth: 1,
					},
					[`&.Mui-error ${outline}`]: { borderColor: color.error.main },
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					fontSize: 13,
					color: color.text.secondary,
					"&.Mui-focused": { color: color.primary.main },
				},
			},
		},
		MuiSelect: {
			styleOverrides: { icon: { color: color.text.disabled } },
		},
	};
}
