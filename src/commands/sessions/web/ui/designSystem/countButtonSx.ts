import { alpha, type Theme } from "@mui/material/styles";

export function countButtonSx(pressed: boolean) {
	return (t: Theme) => ({
		px: 1,
		py: "3px",
		border: 1,
		borderRadius: `${t.tokens.radius.sm}px`,
		borderColor: pressed ? alpha(t.palette.primary.main, 0.55) : "divider",
		bgcolor: pressed ? t.tokens.color.selected : "background.default",
		fontSize: 11,
		textDecoration: "none",
		transition: "border-color .2s ease, background-color .2s ease",
		"&:hover": {
			textDecoration: "none",
			borderColor: pressed
				? alpha(t.palette.primary.main, 0.55)
				: t.palette.text.disabled,
		},
	});
}
