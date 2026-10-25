import { Typography } from "@mui/material";

export function AssistPopoverFooter({
	error,
	busy,
}: {
	error?: string;
	busy: boolean;
}) {
	return (
		<>
			{error && (
				<Typography
					role="alert"
					variant="caption"
					color="error"
					sx={{ display: "block", mt: 0.5 }}
				>
					Not sent: {error}
				</Typography>
			)}
			<Typography
				variant="caption"
				color="text.secondary"
				sx={{ display: "block", mt: 0.5 }}
			>
				{busy
					? "Sending…"
					: `Enter to ${error ? "retry" : "send"} · Shift+Enter for a new line · Esc to close`}
			</Typography>
		</>
	);
}
