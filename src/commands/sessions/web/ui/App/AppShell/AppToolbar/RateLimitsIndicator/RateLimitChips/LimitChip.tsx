import Box from "@mui/material/Box";
import { rateLimitLevel } from "../../../../../../../../../shared/rateLimitLevel";
import {
	limitLevelOnDarkColor,
	ON_DARK_SECONDARY,
} from "../limitLevelOnDarkColor";
import { limitChipTimeLabel } from "./limitChipTimeLabel";

type Window = { used_percentage?: number; resets_at?: number };

export function LimitChip({
	window,
	windowSeconds,
	fallbackLabel,
	now,
}: {
	window: Window | undefined;
	windowSeconds: number;
	fallbackLabel: string;
	now: number;
}) {
	const pct = window?.used_percentage;
	if (pct == null) return null;
	const level = rateLimitLevel(pct, window?.resets_at, windowSeconds, now);
	const timeLabel = limitChipTimeLabel(window?.resets_at, fallbackLabel, now);
	return (
		<Box component="span">
			<Box component="span" sx={{ color: limitLevelOnDarkColor(level) }}>
				{Math.round(pct)}%
			</Box>{" "}
			<Box component="span" sx={{ color: ON_DARK_SECONDARY }}>
				({timeLabel})
			</Box>
		</Box>
	);
}
