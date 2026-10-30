import Box from "@mui/material/Box";
import type { RateLimitLevel } from "../../../../../../../../../../shared/rateLimitLevel";
import { limitLevelOnDarkColor } from "../../limitLevelOnDarkColor";

const slotSx = { display: "contents" } as const;

export function RateLimitThresholdSlot({
	direction,
	threshold,
}: {
	direction: "back" | "forward";
	threshold: { level: RateLimitLevel; pct: number } | undefined;
}) {
	const back = direction === "back";
	if (!threshold)
		return (
			<Box component="span" sx={slotSx}>
				<span />
				<span />
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
				textAlign: "right",
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
