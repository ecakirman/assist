import { alpha, type Theme } from "@mui/material/styles";
import { cardCloseClassName } from "../../../cardCloseClassName";

export function selectionSx(t: Theme, active: boolean) {
	if (t.design !== "slate")
		return {
			borderRadius: 0,
			borderLeft: 2,
			borderLeftColor: active ? t.palette.primary.main : "transparent",
		};
	return {
		gridTemplateColumns: "14px minmax(0, 1fr) auto",
		width: `calc(100% - ${t.spacing(1.5)})`,
		mx: 0.75,
		my: "1px",
		p: "7px 8px",
		borderRadius: `${t.tokens.radius.sm}px`,
		border: 1,
		borderColor: active ? alpha(t.palette.primary.main, 0.35) : "transparent",
		[`& .${cardCloseClassName}`]: {
			display: "inline-flex",
			opacity: 0,
			transition: "opacity 0.2s ease",
		},
		[`& .${cardCloseClassName} .MuiIconButton-root`]: {
			width: 20,
			height: 20,
			my: "-2px",
			"& .MuiSvgIcon-root": { fontSize: 14 },
		},
		[`&:hover .${cardCloseClassName}, &:focus-within .${cardCloseClassName}`]: {
			opacity: 1,
		},
		"& [data-testid='git-status-counts'] .MuiLink-root": { fontSize: 11 },
	};
}
