import { TextField } from "@mui/material";
import { useState } from "react";
import { CommentNoteActions } from "./CommentNoteForm/CommentNoteActions";

export function CommentNoteForm({
	unavailable,
	onAdd,
	onQueue,
	onAddRule,
	onCancel,
	onCollapse,
}: {
	unavailable?: string | undefined;
	onAdd: (note: string) => void;
	onQueue?: ((note: string) => void) | undefined;
	onAddRule?: ((note: string) => void) | undefined;
	onCancel: () => void;
	onCollapse?: (() => void) | undefined;
}) {
	const [note, setNote] = useState("");
	const trimmed = note.trim();
	const submit = () => {
		if (trimmed && !unavailable) onAdd(trimmed);
	};

	return (
		<>
			<TextField
				autoFocus
				multiline
				minRows={2}
				maxRows={8}
				size="small"
				placeholder="Add a note…"
				value={note}
				onChange={(e) => setNote(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						submit();
					}
				}}
			/>
			<CommentNoteActions
				disabled={trimmed.length === 0}
				unavailable={unavailable}
				onAdd={submit}
				onQueue={onQueue ? () => onQueue(trimmed) : undefined}
				onAddRule={onAddRule ? () => onAddRule(trimmed) : undefined}
				onCancel={onCancel}
				onCollapse={onCollapse}
			/>
		</>
	);
}
