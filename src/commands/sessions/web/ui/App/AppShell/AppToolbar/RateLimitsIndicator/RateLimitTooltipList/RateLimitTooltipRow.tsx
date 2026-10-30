import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { nextRateLimitStep } from "../../../../../../../../../shared/nextRateLimitStep";
import { rateLimitLevel } from "../../../../../../../../../shared/rateLimitLevel";
import { limitLevelOnDarkColor } from "../limitLevelOnDarkColor";
import { rateLimitRecoveryNote } from "./RateLimitTooltipRow/rateLimitRecoveryNote";
import { RateLimitThresholdSlot } from "./RateLimitTooltipRow/RateLimitThresholdSlot";
import { rateLimitTooltipRowSx } from "./RateLimitTooltipRow/rateLimitTooltipRowSx";

export function RateLimitTooltipRow({
	label,
	pct,
	resetsAt,
	windowSeconds,
	now,
}: {
	label: string;
	pct: number;
	resetsAt: number | undefined;
	windowSeconds: number;
	now: number;
}) {
	const sx = rateLimitTooltipRowSx(useTheme().design === "slate");
	const level = rateLimitLevel(pct, resetsAt, windowSeconds, now);
	const next = nextRateLimitStep(pct, resetsAt, windowSeconds, now);
	const projected = next.kind === "projected" ? next : undefined;
	return (
		<Box sx={sx.row}>
			<Box component="span" sx={{ minWidth: "2ch" }}>
				{label}
			</Box>
			<RateLimitThresholdSlot
				direction="back"
				threshold={projected?.recovery}
			/>
			<Box
				component="span"
				sx={{
					minWidth: "4ch",
					textAlign: "right",
					fontWeight: sx.pctWeight,
					color: limitLevelOnDarkColor(level),
				}}
			>
				{Math.round(pct)}%
			</Box>
			<RateLimitThresholdSlot
				direction="forward"
				threshold={projected?.worse}
			/>
			<Box component="span" sx={sx.note}>
				{projected
					? projected.recovery && rateLimitRecoveryNote(projected.recovery, now)
					: "no projection yet"}
			</Box>
		</Box>
	);
}
