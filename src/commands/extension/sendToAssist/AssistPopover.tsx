import { Paper } from "@mui/material";
import { useState } from "react";
import { AssistInstructionsField } from "./AssistInstructionsField";
import { AssistPopoverButtons } from "./AssistPopoverButtons";
import { AssistPopoverFooter } from "./AssistPopoverFooter";
import { closeWhenFocusLeaves } from "./closeWhenFocusLeaves";
import { copyWhenEmptyKeyDown } from "./copyWhenEmptyKeyDown";
import { popoverKeyDown } from "./popoverKeyDown";

export function AssistPopover({
	onSend,
	onClose,
	placeholder = "Instructions (optional)",
	error,
	busy = false,
	keepDraftOnBlur = false,
	copyWhenEmpty,
	buttons,
}: {
	onSend: (instructions: string, button: number) => void;
	onClose: (restoreFocus: boolean) => void;
	placeholder?: string;
	error?: string;
	busy?: boolean;
	keepDraftOnBlur?: boolean;
	copyWhenEmpty?: string;
	buttons?: string[];
}) {
	const [instructions, setInstructions] = useState("");

	const send = (button: number) => {
		if (!busy) onSend(instructions, button);
	};

	const onKeyDown = copyWhenEmptyKeyDown(
		copyWhenEmpty,
		!instructions,
		popoverKeyDown(onClose, () => send(0)),
	);

	const hasDraft = keepDraftOnBlur && instructions.trim() !== "";
	const onBlur = closeWhenFocusLeaves(
		Boolean(error) || busy || hasDraft,
		onClose,
	);

	return (
		<Paper elevation={8} sx={{ p: 1.5 }} onBlur={onBlur}>
			<AssistInstructionsField
				value={instructions}
				onChange={setInstructions}
				onKeyDown={onKeyDown}
				placeholder={placeholder}
				error={Boolean(error)}
			/>
			{buttons && (
				<AssistPopoverButtons labels={buttons} disabled={busy} onClick={send} />
			)}
			<AssistPopoverFooter error={error} busy={busy} />
		</Paper>
	);
}
