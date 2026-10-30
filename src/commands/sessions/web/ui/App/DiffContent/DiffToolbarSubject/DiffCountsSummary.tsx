import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { DiffTotals } from "../diffFileTotals";

const summarySx = (t: Theme) => ({
	flex: "0 0 auto",
	fontVariantNumeric: "tabular-nums",
	...(t.design === "slate" && {
		fontFamily: t.typography.fontFamilyMono,
		fontSize: 12,
		color: "text.secondary",
	}),
});

export function DiffCountsSummary({
	totals,
	compact,
}: {
	totals: DiffTotals;
	compact: boolean;
}) {
	if (totals.files === 0) return null;

	return (
		<Typography variant="caption" color="text.disabled" noWrap sx={summarySx}>
			{totals.files} {totals.files === 1 ? "file" : "files"}
			{!compact && (
				<>
					<Box component="span" sx={{ ml: 1, color: "success.main" }}>
						+{totals.added}
					</Box>
					<Box component="span" sx={{ ml: 0.75, color: "error.main" }}>
						−{totals.removed}
					</Box>
				</>
			)}
		</Typography>
	);
}
