import type { Theme } from "@mui/material/styles";
import type { RateLimitLevel } from "../../../../../../../../shared/rateLimitLevel";
import { chromeColors } from "../../../../designSystem/chromeColors";

export const chromeSecondary = (theme: Theme) => chromeColors(theme).secondary;

export function limitLevelChromeColor(level: RateLimitLevel) {
	return (theme: Theme) => chromeColors(theme).level[level];
}
