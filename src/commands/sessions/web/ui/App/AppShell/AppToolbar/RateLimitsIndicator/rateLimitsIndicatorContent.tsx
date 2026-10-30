import type { ReactNode } from "react";
import { HarnessRateLimitChips } from "./HarnessRateLimitChips";
import { HarnessRateLimitsTooltip } from "./HarnessRateLimitsTooltip";
import type { HarnessLimitGroup } from "./harnessLimitGroups";

const RATE_LIMITS_TOOLTIP_HINT =
	"Claude account usage (5h / 7d windows) — view history";

export function rateLimitsIndicatorContent(groups: HarnessLimitGroup[]): {
	title: ReactNode;
	content: ReactNode;
} {
	if (groups.length === 0)
		return { title: RATE_LIMITS_TOOLTIP_HINT, content: "Usage" };
	return {
		title: <HarnessRateLimitsTooltip groups={groups} />,
		content: <HarnessRateLimitChips groups={groups} />,
	};
}
