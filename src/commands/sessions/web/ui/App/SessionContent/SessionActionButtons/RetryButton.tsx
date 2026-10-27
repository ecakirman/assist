import ReplayIcon from "@mui/icons-material/Replay";
import { ActionButton } from "../../ActionButton";
import type { ShortcutName } from "../../shortcutRegistry";

export function RetryButton({
	id,
	onRetry,
	shortcut,
}: {
	id: string;
	onRetry: () => void;
	shortcut?: ShortcutName;
}) {
	return (
		<ActionButton
			label="Retry"
			title={`Retry session ${id}`}
			shortcut={shortcut}
			icon={<ReplayIcon sx={{ fontSize: 14 }} />}
			onClick={(e) => {
				e.stopPropagation();
				onRetry();
			}}
		/>
	);
}
