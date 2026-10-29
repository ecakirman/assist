import { alpha } from "@mui/material/styles";

export const tintedColors = [
	"primary",
	"secondary",
	"success",
	"warning",
	"error",
	"info",
] as const;

export function tintedStyle(main: string, fill: number) {
	return {
		backgroundColor: alpha(main, fill),
		borderColor: alpha(main, 0.35),
		color: main,
	};
}
