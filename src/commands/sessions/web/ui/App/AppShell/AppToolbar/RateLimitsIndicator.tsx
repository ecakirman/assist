import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import { Link as RouterLink } from "react-router";
import type {
	HarnessRateLimits,
	RateLimits,
} from "../../../../../../../shared/RateLimits";
import { HarnessRateLimitChips } from "./RateLimitsIndicator/HarnessRateLimitChips";
import { HarnessRateLimitsTooltip } from "./RateLimitsIndicator/HarnessRateLimitsTooltip";
import { harnessLimitGroups } from "./RateLimitsIndicator/harnessLimitGroups";
import { RateLimitChips } from "./RateLimitsIndicator/RateLimitChips";
import { rateLimitsIndicatorSx } from "./RateLimitsIndicator/rateLimitsIndicatorSx";
import {
	RATE_LIMITS_TOOLTIP_HINT,
	RateLimitsTooltip,
} from "./RateLimitsIndicator/RateLimitsTooltip";

const NO_HARNESS_LIMITS: HarnessRateLimits = {};

export function RateLimitsIndicator({
	rateLimits,
	harnessRateLimits = NO_HARNESS_LIMITS,
	onStatusBar = false,
}: {
	rateLimits: RateLimits | null;
	harnessRateLimits?: HarnessRateLimits;
	onStatusBar?: boolean;
}) {
	const groups = harnessLimitGroups(rateLimits, harnessRateLimits);
	const claudeOnly = groups.every((g) => g.harness === "claude");
	const claude = rateLimits as RateLimits;
	let title: React.ReactNode = RATE_LIMITS_TOOLTIP_HINT;
	let content: React.ReactNode = "Usage";
	if (groups.length > 0 && claudeOnly) {
		title = <RateLimitsTooltip rateLimits={claude} />;
		content = <RateLimitChips rateLimits={claude} />;
	} else if (groups.length > 0) {
		title = <HarnessRateLimitsTooltip groups={groups} />;
		content = <HarnessRateLimitChips groups={groups} />;
	}
	return (
		<Tooltip title={title} placement={onStatusBar ? "top-start" : "bottom"}>
			<Link
				component={RouterLink}
				to="/usage"
				underline={onStatusBar ? "none" : "hover"}
				color="inherit"
				sx={rateLimitsIndicatorSx(onStatusBar)}
			>
				{content}
			</Link>
		</Tooltip>
	);
}
