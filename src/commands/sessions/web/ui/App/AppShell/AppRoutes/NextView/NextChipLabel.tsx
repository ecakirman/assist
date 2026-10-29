import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import type { NextChip } from "./nextChips";

export function NextChipLabel({ chip }: { chip: NextChip }) {
	const { design } = useTheme();
	return (
		<Chip
			label={chip.label}
			size="small"
			color={chip.color}
			variant={design === "slate" ? "tonal" : "outlined"}
		/>
	);
}
