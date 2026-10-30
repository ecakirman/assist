import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import { Link as RouterLink } from "react-router";
import type {
	HarnessRateLimits,
	RateLimits,
} from "../../../../../../../shared/RateLimits";
import { harnessLimitGroups } from "./RateLimitsIndicator/harnessLimitGroups";
import { rateLimitsIndicatorContent } from "./RateLimitsIndicator/rateLimitsIndicatorContent";
import {
	rateLimitsIndicatorSx,
	statusBarTooltipSlotProps,
} from "./RateLimitsIndicator/rateLimitsIndicatorSx";

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
	const { title, content } = rateLimitsIndicatorContent(
		harnessLimitGroups(rateLimits, harnessRateLimits),
		onStatusBar,
	);
	return (
		<Tooltip
			title={title}
			placement={onStatusBar ? "top-start" : "bottom"}
			slotProps={onStatusBar ? statusBarTooltipSlotProps : undefined}
		>
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
