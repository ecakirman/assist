import { Chip } from "@mui/material";
import type { BacklogItem } from "../types";
import { slateStatusLabel, slateStatusSelectSx } from "./slateStatusSelectSx";
import { StatusSelect } from "./StatusSelect";
import { statusChipColors } from "./typeChipColors";

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
	if (!onStatusChange) {
		return (
			<Chip
				label={slateStatusLabel(current)}
				size="small"
				color={statusChipColors[current]}
			/>
		);
	}
	return (
		<StatusSelect
			value={current}
			options={allStatuses}
			onChange={onStatusChange}
			label={slateStatusLabel}
			sx={slateStatusSelectSx(current)}
		/>
	);
}
