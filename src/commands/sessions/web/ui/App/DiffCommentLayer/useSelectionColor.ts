import { alpha, useTheme } from "@mui/material/styles";
import { commentColor } from "../commentColor";

export function useSelectionColor() {
	const theme = useTheme();
	return theme.design === "slate"
		? alpha(theme.palette.primary.main, 0.3)
		: commentColor(0).fill;
}
