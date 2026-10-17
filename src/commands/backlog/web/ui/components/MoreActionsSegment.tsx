import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button } from "@mui/material";
import type { MouseEvent } from "react";
import { compactSegmentSx } from "./BuildSegment";

export function MoreActionsSegment({
	disabled,
	onClick,
}: {
	disabled: boolean;
	onClick: (event: MouseEvent) => void;
}) {
	return (
		<Button
			aria-label="More actions"
			sx={compactSegmentSx}
			disabled={disabled}
			onClick={onClick}
		>
			<ArrowDropDownIcon fontSize="small" />
		</Button>
	);
}
