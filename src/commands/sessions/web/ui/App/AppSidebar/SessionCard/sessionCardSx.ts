import type { SxProps, Theme } from "@mui/material";
import type { DisplayStatus } from "../../../displayStatus";

const attentionWash: Partial<
	Record<DisplayStatus, keyof Theme["tokens"]["color"]["wash"]>
> = {
	waiting: "warning",
	error: "error",
};

export function sessionCardSx(
	active: boolean,
	status: DisplayStatus,
): SxProps<Theme> {
	return {
		display: "grid",
		gridTemplateColumns: "16px minmax(0, 1fr) auto",
		columnGap: 1,
		alignItems: "center",
		width: "100%",
		textAlign: "left",
		p: "5px 10px",
		borderRadius: 0,
		borderLeft: 2,
		borderLeftColor: active ? "primary.main" : "transparent",
		bgcolor: (t) => {
			const wash = attentionWash[status];
			if (active) return t.palette.action.selected;
			return wash ? t.tokens.color.wash[wash] : t.palette.background.default;
		},
		cursor: active ? "default" : "pointer",
		transition: "background 0.2s ease",
		"&:hover": !active ? { bgcolor: "action.hover" } : undefined,
	};
}
