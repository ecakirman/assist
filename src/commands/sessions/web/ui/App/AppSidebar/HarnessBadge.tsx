import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import type { HarnessKind } from "../../../../../../shared/harnesses";
import {
	harnessLabel,
	resolveHarness,
} from "../../../../../../shared/harnessLabel";
import { tokenBadgeSx } from "../../designSystem/tokenBadgeSx";

const chipSx = { height: 18, fontSize: "0.65rem" };

const slateSx = tokenBadgeSx("neutral");

export function HarnessBadge({ harness }: { harness?: HarnessKind }) {
	const slate = useTheme().design === "slate";
	if (resolveHarness(harness) === "claude") return null;
	if (slate)
		return (
			<Box component="span" sx={slateSx}>
				{harnessLabel(harness).toLowerCase()}
			</Box>
		);
	return (
		<Chip
			label={harnessLabel(harness)}
			size="small"
			color="secondary"
			variant="outlined"
			sx={chipSx}
		/>
	);
}
