import type { SxProps, Theme } from "@mui/material/styles";

export const positionSx: SxProps<Theme> = (t) => ({
	position: "absolute",
	top: 0,
	right: 0,
	px: 1,
	py: t.design === "slate" ? 0.5 : 1.25,
	fontSize: "0.75rem",
	lineHeight: t.design === "slate" ? 1.4 : "1.4rem",
	color: "text.disabled",
	fontVariantNumeric: "tabular-nums",
});
