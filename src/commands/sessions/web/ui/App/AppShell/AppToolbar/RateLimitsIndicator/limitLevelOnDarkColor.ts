import { amber, green, red } from "@mui/material/colors";
import type { Theme } from "@mui/material/styles";
import type { RateLimitLevel } from "../../../../../../../../shared/rateLimitLevel";

const PALETTE_KEY = {
	ok: "success",
	warn: "warning",
	over: "error",
} as const satisfies Record<RateLimitLevel, string>;

const LIGHT_MODE_TINT: Record<RateLimitLevel, string> = {
	ok: green.A100,
	warn: amber.A100,
	over: red[100],
};

export const ON_DARK_SECONDARY = "rgba(255, 255, 255, 0.7)";

export function limitLevelOnDarkColor(level: RateLimitLevel) {
	return (theme: Theme) =>
		theme.palette.mode === "dark"
			? theme.palette[PALETTE_KEY[level]].main
			: LIGHT_MODE_TINT[level];
}
