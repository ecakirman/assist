import Alert from "@mui/material/Alert";
import { Toast } from "../Toast";

export function CommentSentSnackbar({
	sessionName,
	onClose,
}: {
	sessionName: string | null;
	onClose: () => void;
}) {
	return (
		<Toast
			open={sessionName !== null}
			autoHideDuration={4000}
			onClose={onClose}
		>
			<Alert severity="success" variant="filled" onClose={onClose}>
				{`Comment sent to ${sessionName}`}
			</Alert>
		</Toast>
	);
}
