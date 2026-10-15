import { MenuItem, MenuList, Paper } from "@mui/material";
import type { FocusEvent, KeyboardEvent } from "react";
import { reviewButtonModes } from "../../../shared/reviewButtonModes";

export function AssistReviewMenu({
	onPick,
	onClose,
}: {
	onPick: (args: string[]) => void;
	onClose: (restoreFocus: boolean) => void;
}) {
	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Escape") return;
		event.preventDefault();
		onClose(true);
	};

	const closeWhenFocusLeaves = (event: FocusEvent<HTMLElement>) => {
		if (event.currentTarget.contains(event.relatedTarget as Node | null))
			return;
		if (document.hasFocus()) onClose(false);
	};

	return (
		<Paper elevation={8}>
			<MenuList
				autoFocusItem
				dense
				aria-label="Start an assist review"
				onKeyDown={onKeyDown}
				onBlur={closeWhenFocusLeaves}
			>
				{reviewButtonModes.map(({ label, args }) => (
					<MenuItem key={label} onClick={() => onPick(args)}>
						{label}
					</MenuItem>
				))}
			</MenuList>
		</Paper>
	);
}
