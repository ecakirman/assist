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
}: {
	rateLimits: RateLimits | null;
	harnessRateLimits?: HarnessRateLimits;
}) {
	const { title, content } = rateLimitsIndicatorContent(
		harnessLimitGroups(rateLimits, harnessRateLimits),
	);
	return (
		<Tooltip
			title={title}
			placement="top-start"
			slotProps={statusBarTooltipSlotProps}
		>
			<Link
				component={RouterLink}
				to="/usage"
				underline="none"
				color="inherit"
				sx={rateLimitsIndicatorSx}
			>
				{content}
			</Link>
		</Tooltip>
	);
}
