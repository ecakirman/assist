import type { Theme } from "@mui/material/styles";
import type { RateLimitLevel } from "../../../../../../../../shared/rateLimitLevel";

export function limitLevelOnDarkColor(level: RateLimitLevel) {
	return (theme: Theme) => theme.tokens.color.onAppBar.level[level];
}
