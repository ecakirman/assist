import { Box, Button, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
	const slate = useTheme().design === "slate";
	const secondary = slate ? "text" : "outlined";
	return (
		<>
			{unavailable && (
				<Typography variant="caption" color="text.secondary">
					{unavailable}
				</Typography>
			)}
			<Stack
				direction="row-reverse"
				spacing={1}
				sx={{ justifyContent: "flex-start" }}
			>
				<CommentSendActions
					disabled={disabled}
					unavailable={unavailable}
					onAdd={onAdd}
					onQueue={onQueue}
				/>
				{slate && <Box sx={{ flex: 1 }} />}
				{onAddRule && (
					<Button
						size="small"
						variant={secondary}
						disabled={disabled}
						onClick={onAddRule}
					>
						Add rule
					</Button>
				)}
				{onCollapse && (
					<Button size="small" variant={secondary} onClick={onCollapse}>
						Collapse
					</Button>
				)}
				<Button size="small" onClick={onCancel}>
					Cancel
				</Button>
			</Stack>
		</>
	);
}
