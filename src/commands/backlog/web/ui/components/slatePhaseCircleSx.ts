import { alpha, type Theme } from "@mui/material/styles";
import type { PhaseStatus } from "../types";

export function slatePhaseCircleSx(status: PhaseStatus | undefined) {
	return (t: Theme) => ({
		display: "inline-grid",
		placeItems: "center",
		flexShrink: 0,
		width: 18,
		height: 18,
		border: 1,
		borderRadius: "50%",
		fontStyle: "normal",
		fontFamily: t.typography.fontFamilyMono,
		fontSize: 10,
		...circleColors(t, status),
	});
}

function circleColors(t: Theme, status: PhaseStatus | undefined) {
	if (status === "done")
		return {
			bgcolor: alpha(t.palette.success.main, 0.18),
			borderColor: "transparent",
			color: "success.main",
		};
	if (status === "current")
		return {
			bgcolor: "primary.main",
			borderColor: "transparent",
			color: "primary.contrastText",
		};
	return { borderColor: "divider", color: "text.disabled" };
}
