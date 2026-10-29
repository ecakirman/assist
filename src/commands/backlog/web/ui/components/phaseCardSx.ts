import { alpha, type Theme } from "@mui/material/styles";
import type { PhaseStatus } from "../types";
import { phaseStatusStyles } from "./phaseStatusStyles";

function classicPhaseCardSx(status: PhaseStatus) {
	const styles = phaseStatusStyles[status];
	return {
		p: 2,
		borderColor: styles.ring ? "info.main" : styles.borderColor,
		bgcolor: styles.bgcolor,
		...(styles.ring ? { boxShadow: "0 0 0 2px" as const } : {}),
	};
}

function slateBorder(theme: Theme, status: PhaseStatus) {
	const { primary, success, divider } = theme.palette;
	if (status === "done") return alpha(success.main, 0.3);
	if (status === "current") return alpha(primary.main, 0.6);
	return divider;
}

function slatePhaseCardSx(theme: Theme, status: PhaseStatus) {
	return {
		p: 2,
		bgcolor: "background.paper",
		borderRadius: `${theme.tokens.radius.md}px`,
		borderColor: slateBorder(theme, status),
		...(status === "current" && {
			boxShadow: `0 0 0 3px ${theme.palette.action.selected}`,
		}),
	};
}

export function phaseCardSx(status: PhaseStatus) {
	return (theme: Theme) =>
		theme.design === "slate"
			? slatePhaseCardSx(theme, status)
			: classicPhaseCardSx(status);
}

export const markers: Record<PhaseStatus, string> = {
	done: "✓",
	current: "•",
	upcoming: "•",
};
