import { Button } from "@mui/material";
import { CommentSendButtons } from "./CommentSendActions/CommentSendButtons";

export function CommentSendActions({
	disabled,
	unavailable,
	onAdd,
	onQueue,
}: {
	disabled: boolean;
	unavailable: string | undefined;
	onAdd: () => void;
	onQueue: (() => void) | undefined;
}) {
	if (onQueue)
		return (
			<CommentSendButtons
				onSend={disabled || unavailable ? undefined : onAdd}
				onQueue={disabled ? undefined : onQueue}
				queuePrimary={Boolean(unavailable)}
			/>
		);
	return (
		<Button
			size="small"
			variant="contained"
			disabled={disabled}
			onClick={onAdd}
		>
			Send to agent
		</Button>
	);
}
