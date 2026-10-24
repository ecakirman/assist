import { Paper, TextField, Typography } from "@mui/material";
import { type KeyboardEvent, useState } from "react";

export function AssistPopover({
	onSend,
	onClose,
	placeholder = "Instructions (optional)",
}: {
	onSend: (instructions: string) => void;
	onClose: (restoreFocus: boolean) => void;
	placeholder?: string;
}) {
	const [instructions, setInstructions] = useState("");

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			event.preventDefault();
			onClose(true);
		} else if (
			event.key === "Enter" &&
			!event.shiftKey &&
			!event.nativeEvent.isComposing
		) {
			event.preventDefault();
			onSend(instructions);
		}
	};

	const closeUnlessWindowBlurred = () => {
		if (document.hasFocus()) onClose(false);
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
				slotProps={{ htmlInput: { "aria-label": "Instructions for assist" } }}
			/>
			<Typography
				variant="caption"
				color="text.secondary"
				sx={{ display: "block", mt: 0.5 }}
			>
				Enter to send · Shift+Enter for a new line · Esc to close
			</Typography>
		</Paper>
	);
}
