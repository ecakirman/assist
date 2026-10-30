import Chip from "@mui/material/Chip";
import type { NextChip } from "./nextChips";

export function NextChipLabel({ chip }: { chip: NextChip }) {
	return (
		<Chip label={chip.label} size="small" color={chip.color} variant="tonal" />
	);
}
