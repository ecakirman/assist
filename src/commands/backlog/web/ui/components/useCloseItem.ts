import { useRef, useState } from "react";
import { useApiNode } from "../../../../sessions/web/ui/useApiNode";
import { updateItemStatus } from "../api";
import { useRepoCwd } from "../useRepoCwd";
import type { ClosingStatus } from "./CloseItemDialog";

export function useCloseItem(
	itemId: number,
	status: ClosingStatus,
	failureMessage: string,
	onSuccess: () => Promise<void>,
) {
	const cwd = useRepoCwd();
	const node = useApiNode();
	const inFlight = useRef(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const confirm = async () => {
		if (inFlight.current) return;
		inFlight.current = true;
		setBusy(true);
		try {
			await updateItemStatus(itemId, status, cwd, node);
		} catch {
			setError(failureMessage);
			inFlight.current = false;
			setBusy(false);
			return;
		}
		await onSuccess();
	};

	return { busy, error, clearError: () => setError(null), confirm };
}
