import { Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { BacklogItem } from "../types";
import { slateStatusLabel, slateStatusSelectSx } from "./slateStatusSelectSx";
import { StatusSelect } from "./StatusSelect";
import { statusChipColors } from "./typeChipColors";

const selectColors: Record<
	BacklogItem["status"],
	{ bg: string; text: string }
> = {
	todo: { bg: "action.selected", text: "text.primary" },
	"in-progress": { bg: "warning.main", text: "warning.contrastText" },
	done: { bg: "success.main", text: "success.contrastText" },
	wontdo: { bg: "error.main", text: "error.contrastText" },
};

const allStatuses: BacklogItem["status"][] = [
	"todo",
	"in-progress",
	"done",
	"wontdo",
];

export function StatusPicker({
	current,
	onStatusChange,
}: {
	current: BacklogItem["status"];
	onStatusChange?: (status: BacklogItem["status"]) => void;
}) {
	const slate = useTheme().design === "slate";
	if (!onStatusChange) {
		return (
			<Chip
				label={slate ? slateStatusLabel(current) : current}
				size="small"
				color={statusChipColors[current]}
				sx={
					slate
						? undefined
						: {
								fontWeight: 500,
								fontSize: "0.75rem",
							}
				}
			/>
		);
	}
	return (
		<StatusSelect
			value={current}
			options={allStatuses}
			colors={selectColors}
			onChange={onStatusChange}
			label={slate ? slateStatusLabel : undefined}
			sx={slate ? slateStatusSelectSx(current) : undefined}
		/>
	);
}
