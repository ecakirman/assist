import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function CommentSendButtons({
	onSend,
	onQueue,
	queuePrimary,
}: {
	onSend: (() => void) | undefined;
	onQueue: (() => void) | undefined;
	queuePrimary: boolean;
}) {
	const secondary = useTheme().design === "slate" ? "tonal" : "outlined";
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
