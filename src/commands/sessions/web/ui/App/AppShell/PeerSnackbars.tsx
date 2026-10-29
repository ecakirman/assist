import Alert from "@mui/material/Alert";
import { ErrorSnackbar } from "../../ErrorSnackbar";
import { Toast } from "../../Toast";

type PeerNotices = {
	back: string | null;
	clearBack: () => void;
	error: string | null;
	clearError: () => void;
	progress?: string | null;
};

export function PeerSnackbars({ notices }: { notices: PeerNotices }) {
	const { back, clearBack, error, clearError, progress } = notices;
	return (
		<>
			<Toast open={Boolean(progress)}>
				<Alert severity="info" variant="filled">
					{progress}
				</Alert>
			</Toast>
			<Toast open={back !== null} autoHideDuration={6000} onClose={clearBack}>
				<Alert severity="success" variant="filled" onClose={clearBack}>
					{back}
				</Alert>
			</Toast>
			<ErrorSnackbar error={error} onClose={clearError} />
		</>
	);
}
