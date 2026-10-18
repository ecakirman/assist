import { formatItemId } from "../../../formatItemId";
import { ErrorSnackbar } from "../../../../sessions/web/ui/ErrorSnackbar";
import { StopCardActivation } from "../../../../sessions/web/ui/StopCardActivation";
import { ConfirmDialog } from "./ConfirmDialog";
import { useCloseItem } from "./useCloseItem";

export type ClosingStatus = "done" | "wontdo";

export type CloseItemTarget = {
	currentPhase?: number;
	totalPhases?: number;
	onClosed: () => Promise<void>;
};

const labels: Record<ClosingStatus, { verb: string; action: string }> = {
	done: { verb: "done", action: "Mark done" },
	wontdo: { verb: "won't do", action: "Won't do" },
};

export function CloseItemDialog({
	itemId,
	status,
	target,
	onClose,
}: {
	itemId: number;
	status: ClosingStatus;
	target: CloseItemTarget;
	onClose: () => void;
}) {
	const { verb, action } = labels[status];
	const label = formatItemId(itemId);
	const { busy, error, clearError, confirm } = useCloseItem(
		itemId,
		status,
		`Failed to mark item ${label} as ${verb}`,
		async () => {
			onClose();
			await target.onClosed();
		},
	);

	return (
		<StopCardActivation>
			<ConfirmDialog
				title={`Mark ${label} ${verb}`}
				message={`${target.currentPhase ?? 0} of ${target.totalPhases ?? 0} phases completed. Mark this backlog item as ${verb}?`}
				confirmLabel={action}
				busy={busy}
				onConfirm={confirm}
				onCancel={onClose}
			/>
			<ErrorSnackbar error={error} onClose={clearError} />
		</StopCardActivation>
	);
}
