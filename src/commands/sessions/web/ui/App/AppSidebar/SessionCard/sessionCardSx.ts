import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import type { DisplayStatus } from "../../../displayStatus";

const attentionWash: Partial<
	Record<DisplayStatus, keyof Theme["tokens"]["color"]["wash"]>
> = {
	waiting: "warning",
	error: "error",
};

function cardBackground(t: Theme, active: boolean, status: DisplayStatus) {
	const wash = attentionWash[status];
	if (active) return t.palette.action.selected;
	if (wash) return t.tokens.color.wash[wash];
	return t.design === "slate" ? "transparent" : t.palette.background.default;
}

function selectionSx(t: Theme, active: boolean) {
	if (t.design !== "slate")
		return {
			borderRadius: 0,
			borderLeft: 2,
			borderLeftColor: active ? t.palette.primary.main : "transparent",
		};
	return {
		width: "auto",
		mx: 0.75,
		my: "1px",
		borderRadius: `${t.tokens.radius.sm}px`,
		border: 1,
		borderColor: active ? alpha(t.palette.primary.main, 0.35) : "transparent",
	};
}

export function sessionCardSx(
	active: boolean,
	status: DisplayStatus,
): SxProps<Theme> {
	return (t) => ({
		display: "grid",
		gridTemplateColumns: "16px minmax(0, 1fr) auto",
		columnGap: 1,
		alignItems: "center",
		width: "100%",
		textAlign: "left",
		p: "5px 10px",
		...selectionSx(t, active),
		bgcolor: cardBackground(t, active, status),
		cursor: active ? "default" : "pointer",
		transition: "background 0.2s ease, border-color 0.2s ease",
		"&:hover": !active ? { bgcolor: "action.hover" } : undefined,
	});
}
