import { alpha, type Theme } from "@mui/material/styles";
import { paletteColor } from "./paletteColor";

export function statusPillSx(colorPath: string) {
	return (t: Theme) => {
		const color = paletteColor(t, colorPath);
		return {
			display: "inline-flex",
			alignItems: "center",
			gap: "5px",
			flexShrink: 0,
			px: 1,
			lineHeight: "18px",
			borderRadius: 999,
			fontSize: 11,
			fontWeight: 600,
			whiteSpace: "nowrap",
			color,
			bgcolor: alpha(color, 0.15),
		};
	};
}
