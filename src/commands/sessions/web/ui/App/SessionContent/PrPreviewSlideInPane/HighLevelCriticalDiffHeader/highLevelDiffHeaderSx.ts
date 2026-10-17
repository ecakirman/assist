import type { Theme } from "@mui/material";
import { JUMP_STRIP_HEIGHT } from "../highLevelCheckDomId";

export const highLevelDiffHeaderSx = {
	position: "sticky",
	top: JUMP_STRIP_HEIGHT,
	zIndex: 3,
	display: "flex",
	alignItems: "center",
	gap: 1,
	minWidth: 0,
	cursor: "pointer",
	borderRadius: 0.5,
	bgcolor: "background.paper",
	"&:hover": {
		backgroundImage: ({ palette }: Theme) =>
			`linear-gradient(${palette.action.hover}, ${palette.action.hover})`,
	},
} as const;
