import { alpha, type Theme } from "@mui/material/styles";
import { lastMessageSx } from "./lastMessageSx";

function slatePillSx(t: Theme, expanded: boolean, hasPosition: boolean) {
	return {
		top: 18,
		left: 18,
		color: "text.primary",
		width: "auto",
		maxWidth: { xs: "60%", md: "40%" },
		px: 1.25,
		py: 0.5,
		pr: hasPosition ? 6 : 1.25,
		border: 1,
		borderColor: "divider",
		borderRadius: expanded ? `${t.tokens.radius.md}px` : 999,
		bgcolor: alpha(t.tokens.color.raised, 0.92),
		backdropFilter: "blur(6px)",
		fontSize: "0.75rem",
		boxShadow: expanded ? t.tokens.elevation.overlay : "none",
	};
}

export function lastMessageReadoutSx(
	pinned: boolean,
	expanded: boolean,
	hasPosition: boolean,
) {
	return (t: Theme) => ({
		...lastMessageSx(pinned, expanded),
		...slatePillSx(t, expanded, hasPosition),
	});
}
