import type { Theme } from "@mui/material/styles";

export function sectionHeadingSx(t: Theme) {
	return {
		color: "text.secondary",
		mb: 1,
		display: "block",
		letterSpacing: "0.08em",
		...(t.design === "slate" && {
			color: "text.disabled",
			fontSize: 11,
			fontWeight: 600,
			lineHeight: 1.6,
		}),
	};
}
