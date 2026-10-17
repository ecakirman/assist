import { Menu, MenuItem } from "@mui/material";
import type { MouseEvent } from "react";
import type { ClosingStatus } from "./CloseItemDialog";

const options: { status: ClosingStatus; label: string }[] = [
	{ status: "done", label: "Mark done" },
	{ status: "wontdo", label: "Won't do" },
];

export function CloseItemMenu({
	anchorEl,
	open,
	onClose,
	onSelect,
	stop,
}: {
	anchorEl: HTMLElement | null;
	open: boolean;
	onClose: () => void;
	onSelect: (status: ClosingStatus) => void;
	stop: (event: MouseEvent) => void;
}) {
	return (
		<Menu anchorEl={anchorEl} open={open} onClose={onClose} onClick={stop}>
			{options.map(({ status, label }) => (
				<MenuItem
					key={status}
					onClick={(event) => {
						stop(event);
						onSelect(status);
					}}
				>
					{label}
				</MenuItem>
			))}
		</Menu>
	);
}
