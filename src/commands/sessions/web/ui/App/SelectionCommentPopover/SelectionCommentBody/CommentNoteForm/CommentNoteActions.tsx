import { Button, Stack, Typography } from "@mui/material";
import { CommentSendActions } from "./CommentNoteActions/CommentSendActions";

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
				<CommentSendActions
					disabled={disabled}
					unavailable={unavailable}
					onAdd={onAdd}
					onQueue={onQueue}
				/>
			</Stack>
		</>
	);
}
