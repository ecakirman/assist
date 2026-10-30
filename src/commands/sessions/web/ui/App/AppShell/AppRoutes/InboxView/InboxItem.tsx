import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { formatRelativeTime } from "../../../../formatRelativeTime";
import type { InboxMessage } from "./types";

const cardSx = {
	display: "flex",
	alignItems: "flex-start",
	gap: 1,
	bgcolor: "background.paper",
	borderRadius: 2,
	p: 2.5,
	transition: "background-color 0.15s",
	"&:hover": { bgcolor: "action.hover" },
} as const;

const dismissSx = {
	color: "text.disabled",
	"&:hover": { color: "text.primary" },
} as const;

export function InboxItem({
	message,
	onDismiss,
}: {
	message: InboxMessage;
	onDismiss: () => void;
}) {
	return (
		<Box sx={cardSx}>
			<Link
				href={message.link}
				target="_blank"
				rel="noopener noreferrer"
				underline="none"
				color="inherit"
				sx={{ flex: 1, minWidth: 0 }}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
					<Chip label={message.source} size="small" />
					<Typography variant="subtitle2">{message.sender}</Typography>
					<Typography variant="body2" color="text.secondary">
						{formatRelativeTime(message.receivedAt)}
					</Typography>
				</Box>
				<Typography variant="body2">{message.summary}</Typography>
			</Link>
			<IconButton
				size="small"
				onClick={onDismiss}
				title={`Dismiss message from ${message.sender}`}
				sx={dismissSx}
			>
				<CloseIcon sx={{ fontSize: 16 }} />
			</IconButton>
		</Box>
	);
}
