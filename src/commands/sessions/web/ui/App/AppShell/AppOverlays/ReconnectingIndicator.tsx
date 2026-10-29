import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Toast } from "../../../Toast";

export function ReconnectingIndicator({
	reconnecting,
}: {
	reconnecting: boolean;
}) {
	return (
		<Toast open={reconnecting}>
			<Alert
				severity="info"
				variant="filled"
				icon={<CircularProgress size={16} color="inherit" />}
			>
				Reconnecting…
			</Alert>
		</Toast>
	);
}
