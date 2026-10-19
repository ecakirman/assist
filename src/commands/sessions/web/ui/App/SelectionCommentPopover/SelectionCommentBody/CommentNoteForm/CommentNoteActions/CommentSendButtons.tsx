import { Button } from "@mui/material";

export function CommentSendButtons({
	onSend,
	onQueue,
}: {
	onSend: (() => void) | undefined;
	onQueue: (() => void) | undefined;
}) {
	return (
		<>
			<Button
				size="small"
				variant="outlined"
				disabled={!onSend}
				onClick={onSend}
				sx={{ whiteSpace: "nowrap" }}
			>
				Send to agent
			</Button>
			<Button
				size="small"
				variant="contained"
				disabled={!onQueue}
				onClick={onQueue}
				sx={{ whiteSpace: "nowrap" }}
			>
				Add to review
			</Button>
		</>
	);
}
