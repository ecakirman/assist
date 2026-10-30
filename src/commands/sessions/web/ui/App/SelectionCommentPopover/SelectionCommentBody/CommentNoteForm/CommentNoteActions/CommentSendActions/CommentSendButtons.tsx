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
	const secondary = "tonal";
	return (
		<>
			<Button
				size="small"
				variant={queuePrimary ? secondary : "contained"}
				disabled={!onSend}
				onClick={onSend}
				sx={{ whiteSpace: "nowrap" }}
			>
				Send to agent
			</Button>
			<Button
				size="small"
				variant={queuePrimary ? "contained" : secondary}
				disabled={!onQueue}
				onClick={onQueue}
				sx={{ whiteSpace: "nowrap" }}
			>
				Add to review
			</Button>
		</>
	);
}
