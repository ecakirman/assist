import { alpha, useTheme } from "@mui/material/styles";

export function useSelectionColor() {
	return alpha(useTheme().palette.primary.main, 0.3);
}
