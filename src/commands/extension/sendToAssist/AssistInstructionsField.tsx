import { TextField } from "@mui/material";
import type { KeyboardEvent } from "react";

export function AssistInstructionsField({
	value,
	onChange,
	onKeyDown,
	placeholder,
	error,
}: {
	value: string;
	onChange: (value: string) => void;
	onKeyDown: (event: KeyboardEvent) => void;
	placeholder: string;
	error: boolean;
}) {
	return (
		<TextField
			autoFocus
			fullWidth
			multiline
			maxRows={6}
			size="small"
			placeholder={placeholder}
			value={value}
			onChange={(event) => onChange(event.target.value)}
			onKeyDown={onKeyDown}
			error={error}
			slotProps={{ htmlInput: { "aria-label": "Instructions for assist" } }}
		/>
	);
}
