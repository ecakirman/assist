import { Button, Stack, Typography } from "@mui/material";

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
			<Button
				size="small"
				variant="outlined"
				disabled={!onSend}
				onClick={onSend}
			>
				Send to agent
			</Button>
			<Button
				size="small"
				variant="contained"
				disabled={!onQueue}
				onClick={onQueue}
			>
				Add to review
			</Button>
		</Stack>
	);
}
