import { Paper, TextField } from "@mui/material";
import { useState } from "react";
import { AssistPopoverFooter } from "./AssistPopoverFooter";
import { popoverKeyDown } from "./popoverKeyDown";

export function AssistPopover({
	onSend,
	onClose,
	placeholder = "Instructions (optional)",
	initialText = "",
	error,
	busy = false,
}: {
	onSend: (instructions: string) => void;
	onClose: (restoreFocus: boolean) => void;
	placeholder?: string;
	initialText?: string;
	error?: string;
	busy?: boolean;
}) {
	const [instructions, setInstructions] = useState(initialText);

	const onKeyDown = popoverKeyDown(onClose, () => {
		if (!busy) onSend(instructions);
	});

	const closeUnlessWindowBlurred = () => {
		if (document.hasFocus() && !error && !busy) onClose(false);
	};

	return (
		<Paper elevation={8} sx={{ p: 1.5 }}>
			<TextField
				autoFocus
				fullWidth
				multiline
				maxRows={6}
				size="small"
				placeholder={placeholder}
				value={instructions}
				onChange={(event) => setInstructions(event.target.value)}
				onKeyDown={onKeyDown}
				onBlur={closeUnlessWindowBlurred}
				error={Boolean(error)}
				slotProps={{ htmlInput: { "aria-label": "Instructions for assist" } }}
			/>
			<AssistPopoverFooter error={error} busy={busy} />
		</Paper>
	);
}
