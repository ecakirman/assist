import { Button, Stack, Typography } from "@mui/material";
import { CommentSendButtons } from "./CommentNoteActions/CommentSendButtons";

export function CommentNoteActions({
	disabled,
	unavailable,
	onAdd,
	onQueue,
	onAddRule,
	onCancel,
	onCollapse,
}: {
	disabled: boolean;
	unavailable?: string | undefined;
	onAdd: () => void;
	onQueue?: (() => void) | undefined;
	onAddRule?: (() => void) | undefined;
	onCancel: () => void;
	onCollapse?: (() => void) | undefined;
}) {
	return (
		<>
			{unavailable && (
				<Typography variant="caption" color="text.secondary">
					{unavailable}
				</Typography>
			)}
			<Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
				<Button size="small" onClick={onCancel}>
					Cancel
				</Button>
				{onCollapse && (
					<Button size="small" variant="outlined" onClick={onCollapse}>
						Collapse
					</Button>
				)}
				{onAddRule && (
					<Button
						size="small"
						variant="outlined"
						disabled={disabled}
						onClick={onAddRule}
					>
						Add rule
					</Button>
				)}
				{onQueue ? (
					<CommentSendButtons
						onSend={disabled || unavailable ? undefined : onAdd}
						onQueue={disabled ? undefined : onQueue}
					/>
				) : (
					<Button
						size="small"
						variant="contained"
						disabled={disabled}
						onClick={onAdd}
					>
						Send to agent
					</Button>
				)}
			</Stack>
		</>
	);
}
