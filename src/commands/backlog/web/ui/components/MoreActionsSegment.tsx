import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import type { MouseEvent, Ref } from "react";

export function MoreActionsSegment({
	anchorRef,
	onClick,
}: {
	anchorRef: Ref<HTMLButtonElement>;
	onClick: (event: MouseEvent) => void;
}) {
	return (
		<IconButton
			ref={anchorRef}
			aria-label="More actions"
			size="small"
			onClick={onClick}
		>
			<MoreVertIcon fontSize="small" />
		</IconButton>
	);
}
