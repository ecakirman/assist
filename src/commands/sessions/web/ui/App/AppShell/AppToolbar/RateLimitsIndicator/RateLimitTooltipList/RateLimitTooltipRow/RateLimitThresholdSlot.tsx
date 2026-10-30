import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import type { RateLimitLevel } from "../../../../../../../../../../shared/rateLimitLevel";
import { limitLevelOnDarkColor } from "../../limitLevelOnDarkColor";
import { thresholdSlotSx } from "./thresholdSlotSx";

export function RateLimitThresholdSlot({
	direction,
	threshold,
}: {
	direction: "back" | "forward";
	threshold: { level: RateLimitLevel; pct: number } | undefined;
}) {
	const slate = useTheme().design === "slate";
	const back = direction === "back";
	const slotSx = thresholdSlotSx(slate, back);
	if (!threshold)
		return (
			<Box component="span" sx={slotSx}>
				{slate && (
					<>
						<span />
						<span />
					</>
				)}
			</Box>
		);
	const arrow = (
		<Box component="span" sx={{ opacity: 0.6 }}>
			{back ? "←" : "→"}
		</Box>
	);
	const value = (
		<Box
			component="span"
			sx={{
				color: limitLevelOnDarkColor(threshold.level),
				textAlign: slate ? "right" : undefined,
			}}
		>
			{Math.round(threshold.pct)}%
		</Box>
	);
	return (
		<Box component="span" sx={slotSx}>
			{back ? value : arrow}
			{back ? arrow : value}
		</Box>
	);
}
