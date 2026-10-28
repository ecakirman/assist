import { Button } from "@mui/material";

export function CommentSendButtons({
	onSend,
	onQueue,
	queuePrimary,
}: {
	onSend: (() => void) | undefined;
	onQueue: (() => void) | undefined;
	queuePrimary: boolean;
}) {
	return (
		<>
			<Button
				size="small"
				variant={queuePrimary ? "contained" : "outlined"}
				disabled={!onQueue}
				onClick={onQueue}
				sx={{ whiteSpace: "nowrap" }}
			>
				Add to review
			</Button>
			<Button
				size="small"
				variant={queuePrimary ? "outlined" : "contained"}
				disabled={!onSend}
				onClick={onSend}
				sx={{ whiteSpace: "nowrap" }}
			>
				Send to agent
			</Button>
		</>
	);
}
