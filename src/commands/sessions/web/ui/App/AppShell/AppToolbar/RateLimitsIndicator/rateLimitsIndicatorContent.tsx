import type { ReactNode } from "react";
import type { RateLimits } from "../../../../../../../../shared/RateLimits";
import { HarnessRateLimitChips } from "./HarnessRateLimitChips";
import { HarnessRateLimitsTooltip } from "./HarnessRateLimitsTooltip";
import type { HarnessLimitGroup } from "./harnessLimitGroups";
import { RateLimitChips } from "./RateLimitChips";
import {
	RATE_LIMITS_TOOLTIP_HINT,
	RateLimitsTooltip,
} from "./RateLimitsTooltip";

export function rateLimitsIndicatorContent(
	groups: HarnessLimitGroup[],
	labelHarnesses: boolean,
): { title: ReactNode; content: ReactNode } {
	if (groups.length === 0)
		return { title: RATE_LIMITS_TOOLTIP_HINT, content: "Usage" };
	const claudeOnly = groups.every((g) => g.harness === "claude");
	if (claudeOnly && !labelHarnesses) {
		const claude: RateLimits = groups[0].rateLimits;
		return {
			title: <RateLimitsTooltip rateLimits={claude} />,
			content: <RateLimitChips rateLimits={claude} />,
		};
	}
	return {
		title: <HarnessRateLimitsTooltip groups={groups} />,
		content: <HarnessRateLimitChips groups={groups} />,
	};
}
