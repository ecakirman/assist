import { Menu, MenuItem } from "@mui/material";
import type { MouseEvent } from "react";

export function MarkDoneMenu({
	anchorEl,
	open,
	onClose,
	onMarkDone,
	stop,
}: {
	anchorEl: HTMLElement | null;
	open: boolean;
	onClose: () => void;
	onMarkDone: () => void;
	stop: (event: MouseEvent) => void;
}) {
	return (
		<Menu anchorEl={anchorEl} open={open} onClose={onClose} onClick={stop}>
			<MenuItem
				onClick={(event) => {
					stop(event);
					onMarkDone();
				}}
			>
				Mark done
			</MenuItem>
		</Menu>
	);
}
