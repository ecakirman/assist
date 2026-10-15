import { Divider, MenuItem, MenuList, Paper } from "@mui/material";
import { type FocusEvent, type KeyboardEvent, useState } from "react";
import { prActions } from "../../../shared/prActions";
import { reviewButtonModes } from "../../../shared/reviewButtonModes";
import {
	reviewOptionArgs,
	reviewOptionDefaults,
} from "../../../shared/reviewOptionFlags";
import { AssistReviewToggles } from "./AssistReviewToggles";

export function AssistReviewMenu({
	onPick,
	onClose,
}: {
	onPick: (args: string[]) => void;
	onClose: (restoreFocus: boolean) => void;
}) {
	const [options, setOptions] = useState(reviewOptionDefaults);

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
				aria-label="Start an assist session for this PR"
				onKeyDown={onKeyDown}
				onBlur={closeWhenFocusLeaves}
			>
				{reviewButtonModes.map(({ label, args }) => (
					<MenuItem
						key={label}
						onClick={() => onPick([...args, ...reviewOptionArgs(options)])}
					>
						{label}
					</MenuItem>
				))}
				<Divider />
				<AssistReviewToggles value={options} onChange={setOptions} />
				<Divider />
				{prActions.map(({ label, args }) => (
					<MenuItem key={label} onClick={() => onPick(args)}>
						{label}
					</MenuItem>
				))}
			</MenuList>
		</Paper>
	);
}
