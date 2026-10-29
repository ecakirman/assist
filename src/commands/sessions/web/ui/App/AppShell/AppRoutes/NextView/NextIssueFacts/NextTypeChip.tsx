import Chip from "@mui/material/Chip";
import type { NextPickup } from "../../../../../../next/types";
import { swatches } from "../../../../../designSystem/swatches";

const TYPE_COLORS = swatches.issueType;

export function NextTypeChip({
	type,
}: {
	type: NonNullable<NextPickup["type"]>;
}) {
	const colors = TYPE_COLORS[type.color] ?? TYPE_COLORS.GRAY;
	return (
		<Chip
			label={type.name}
			size="small"
			variant="outlined"
			sx={(theme) => {
				const color =
					theme.palette.mode === "dark" ? colors.dark : colors.light;
				return { color, borderColor: color, height: 20 };
			}}
		/>
	);
}
