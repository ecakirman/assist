import Alert from "@mui/material/Alert";
import { Toast } from "./Toast";

type Props = {
	error: string | null;
	onClose: () => void;
};

export function ErrorSnackbar({ error, onClose }: Props) {
	return (
		<Toast open={error !== null} autoHideDuration={8000} onClose={onClose}>
			<Alert severity="error" variant="filled" onClose={onClose}>
				{error}
			</Alert>
		</Toast>
	);
}
