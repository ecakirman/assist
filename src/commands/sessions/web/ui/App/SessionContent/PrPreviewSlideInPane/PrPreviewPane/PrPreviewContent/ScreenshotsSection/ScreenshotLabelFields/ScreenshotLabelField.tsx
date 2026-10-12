import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

export function ScreenshotLabelField({
	label,
	value,
	onCommit,
	listId,
}: {
	label: string;
	value: string;
	onCommit: (value: string) => void;
	listId?: string;
}) {
	const [draft, setDraft] = useState(value);
	useEffect(() => setDraft(value), [value]);

	const commit = () => {
		const next = draft.trim();
		setDraft(value);
		if (next !== value) onCommit(next);
	};

	return (
		<TextField
			size="small"
			variant="standard"
			fullWidth
			label={label}
			value={draft}
			onChange={(e) => setDraft(e.target.value)}
			onBlur={commit}
			onKeyDown={(e) => {
				if (e.key === "Enter") (e.target as HTMLInputElement).blur();
			}}
			onMouseDown={(e) => e.stopPropagation()}
			slotProps={{ htmlInput: { list: listId } }}
		/>
	);
}
