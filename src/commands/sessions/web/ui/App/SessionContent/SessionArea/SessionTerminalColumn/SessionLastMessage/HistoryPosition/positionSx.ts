import type { SxProps, Theme } from "@mui/material/styles";

const slateSx = (t: Theme) => ({
	py: 0.5,
	fontFamily: t.typography.fontFamilyMono,
	fontSize: 10.5,
	lineHeight: "18px",
});

export const positionSx: SxProps<Theme> = (t) => ({
	position: "absolute",
	top: 0,
	right: 0,
	px: 1,
	py: 1.25,
	fontSize: "0.75rem",
	lineHeight: "1.4rem",
	color: "text.disabled",
	fontVariantNumeric: "tabular-nums",
	...(t.design === "slate" && slateSx(t)),
});
