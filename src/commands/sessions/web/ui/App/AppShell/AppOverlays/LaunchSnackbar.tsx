import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { Toast } from "../../../Toast";
import type { SuccessNotice } from "../../../useNotices";

type Props = {
	notice: SuccessNotice | null;
	onClose: () => void;
	onView: (sessionId: string) => void;
};

export function LaunchSnackbar({ notice, onClose, onView }: Props) {
	const sessionId = notice?.sessionId ?? null;
	return (
		<Toast open={notice !== null} autoHideDuration={6000} onClose={onClose}>
			<Alert
				severity="success"
				variant="filled"
				onClose={onClose}
				action={
					sessionId !== null ? (
						<Button
							color="inherit"
							size="small"
							onClick={() => onView(sessionId)}
						>
							View
						</Button>
					) : undefined
				}
			>
				{notice?.message}
			</Alert>
		</Toast>
	);
}
