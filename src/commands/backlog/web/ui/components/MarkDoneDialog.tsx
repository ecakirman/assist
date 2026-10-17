import { useState } from "react";
import { formatItemId } from "../../../formatItemId";
import { ErrorSnackbar } from "../../../../sessions/web/ui/App/ErrorSnackbar";
import { StopCardActivation } from "../../../../sessions/web/ui/App/StopCardActivation";
import { useApiNode } from "../../../../sessions/web/ui/useApiNode";
import { updateItemStatus } from "../api";
import { useRepoCwd } from "../useRepoCwd";
import { ConfirmDialog } from "./ConfirmDialog";

export type MarkDoneTarget = {
	currentPhase?: number;
	totalPhases?: number;
	onMarkedDone: () => Promise<void>;
};

export function MarkDoneDialog({
	itemId,
	target,
	onClose,
}: {
	itemId: number;
	target: MarkDoneTarget;
	onClose: () => void;
}) {
	const cwd = useRepoCwd();
	const node = useApiNode();
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleConfirm = async () => {
		setBusy(true);
		try {
			await updateItemStatus(itemId, "done", cwd, node);
		} catch {
			setError(`Failed to mark item ${formatItemId(itemId)} as done`);
			setBusy(false);
			return;
		}
		onClose();
		await target.onMarkedDone();
	};

	return (
		<StopCardActivation>
			<ConfirmDialog
				title={`Mark ${formatItemId(itemId)} done`}
				message={`${target.currentPhase ?? 0} of ${target.totalPhases ?? 0} phases completed. Mark this backlog item as done?`}
				confirmLabel="Mark done"
				busy={busy}
				onConfirm={handleConfirm}
				onCancel={onClose}
			/>
			<ErrorSnackbar error={error} onClose={() => setError(null)} />
		</StopCardActivation>
	);
}
