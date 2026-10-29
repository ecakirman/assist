import Alert from "@mui/material/Alert";
import { Toast } from "../../../Toast";

export function DiffRevertSnackbar({
	error,
	onClose,
}: {
	error: string | null;
	onClose: () => void;
}) {
	return (
		<Toast open={error !== null} autoHideDuration={6000} onClose={onClose}>
			<Alert severity="error" variant="filled" onClose={onClose}>
				{error}
			</Alert>
		</Toast>
	);
}
