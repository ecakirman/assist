import { alpha, type Theme } from "@mui/material/styles";
import { paletteColor } from "../../../../sessions/web/ui/designSystem/paletteColor";
import type { BacklogItem } from "../types";

const statusColor: Record<BacklogItem["status"], string> = {
	todo: "text.secondary",
	"in-progress": "warning.main",
	done: "success.main",
	wontdo: "error.main",
};

const statusLabel: Record<BacklogItem["status"], string> = {
	todo: "to do",
	"in-progress": "in progress",
	done: "done",
	wontdo: "won't do",
};

export function slateStatusLabel(status: BacklogItem["status"]) {
	return statusLabel[status];
}

export function slateStatusSelectSx(status: BacklogItem["status"]) {
	return (t: Theme) => {
		const color = paletteColor(t, statusColor[status]);
		return {
			height: 20,
			minHeight: 0,
			borderRadius: 999,
			fontSize: 11,
			fontWeight: 600,
			color,
			bgcolor: alpha(color, 0.15),
			"&:hover": { bgcolor: alpha(color, 0.22) },
			"& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline":
				{ border: 0 },
			"& .MuiSelect-select.MuiSelect-select": {
				py: 0,
				pl: 1,
				pr: "22px",
				minHeight: 0,
				lineHeight: "20px",
			},
			"& .MuiSelect-icon": { color: "inherit", fontSize: 16, right: 4 },
		};
	};
}
