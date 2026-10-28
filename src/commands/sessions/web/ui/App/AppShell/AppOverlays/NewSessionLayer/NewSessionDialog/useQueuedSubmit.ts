import { useEffect, useState } from "react";
import type { NewSessionDraft } from "../useNewSessionDraft";

export function useQueuedSubmit(draft: NewSessionDraft, submit: () => void) {
	const [queued, setQueued] = useState(false);

	useEffect(() => {
		if (!queued || draft.modePending) return;
		setQueued(false);
		submit();
	}, [queued, draft.modePending, submit]);

	return () => {
		if (draft.modePending) setQueued(true);
		else submit();
	};
}
