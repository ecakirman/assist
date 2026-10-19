import { Stack, Typography } from "@mui/material";
import { CommentSendButtons } from "../../../../../../CommentSendButtons";

export function HighLevelTestNoteActions({
	unavailable,
	onSend,
	onQueue,
}: {
	unavailable: string | undefined;
	onSend: (() => void) | undefined;
	onQueue: (() => void) | undefined;
}) {
	return (
		<Stack
			direction="row"
			spacing={1}
			sx={{ mt: 0.5, alignItems: "center", justifyContent: "flex-end" }}
		>
			{unavailable && (
				<Typography variant="caption" sx={{ flex: 1, color: "text.secondary" }}>
					{unavailable}
				</Typography>
			)}
			<CommentSendButtons onSend={onSend} onQueue={onQueue} />
		</Stack>
	);
}
