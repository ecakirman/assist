import type { Theme } from "@mui/material/styles";
import { JUMP_TARGET_OFFSET } from "../../../../../highLevelCheckDomId";

const failedTint = (t: Theme) => t.tokens.color.wash.error;

export function highLevelItemSx(failed: boolean) {
	return {
		scrollMarginTop: `${JUMP_TARGET_OFFSET}px`,
		px: 2,
		py: 1.25,
		borderLeft: 3,
		borderColor: failed ? "error.main" : "transparent",
		bgcolor: failed ? failedTint : undefined,
	} as const;
}
