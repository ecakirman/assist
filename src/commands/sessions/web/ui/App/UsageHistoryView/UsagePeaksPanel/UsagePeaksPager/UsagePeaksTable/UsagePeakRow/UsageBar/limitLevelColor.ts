import type { RateLimitLevel } from "../../../../../../../../../../../shared/rateLimitLevel";

const LEVEL_COLOR: Record<RateLimitLevel, string> = {
	ok: "success.main",
	warn: "warning.main",
	over: "error.main",
};

export function limitLevelColor(level: RateLimitLevel): string {
	return LEVEL_COLOR[level];
}
