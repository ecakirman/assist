import { Box, TextField } from "@mui/material";
import { useState } from "react";
import type { DiffComment } from "../../../../../formatDiffComment";
import type { HighLevelDiffComments } from "../../../HighLevelDiffComments";
import { HighLevelTestNoteActions } from "./HighLevelTestNote/HighLevelTestNoteActions";

export function HighLevelTestNote({
	comment,
	indent,
	comments,
	onDone,
}: {
	comment: Omit<DiffComment, "note">;
	indent: string;
	comments?: HighLevelDiffComments | undefined;
	onDone: () => void;
}) {
	const [note, setNote] = useState("");
	const trimmed = note.trim();
	const deliver = (to: ((comment: DiffComment) => void) | undefined) =>
		to && trimmed
			? () => {
					to({ ...comment, note: trimmed });
					setNote("");
					onDone();
				}
			: undefined;
	return (
		<Box sx={{ pl: `calc(${indent} + 20px)`, py: 0.5 }}>
			<TextField
				variant="standard"
				size="small"
				fullWidth
				multiline
				autoFocus
				value={note}
				onChange={(e) => setNote(e.target.value)}
				placeholder="Comment on this test"
				slotProps={{
					htmlInput: { "aria-label": `Comment for ${comment.quote}` },
				}}
				sx={{ "& .MuiInputBase-input": { fontSize: 12 } }}
			/>
			<HighLevelTestNoteActions
				unavailable={comments?.unavailable}
				onSend={deliver(comments?.onComment)}
				onQueue={deliver(comments?.onQueue)}
			/>
		</Box>
	);
}
