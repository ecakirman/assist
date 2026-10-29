import { useCallback, useState } from "react";
import { NewSessionDialog } from "./NewSessionLayer/NewSessionDialog";
import type { NewSessionLaunchers } from "./NewSessionLayer/launchNewSession";
import { useNewSessionDraft } from "./NewSessionLayer/useNewSessionDraft";
import { useNewSessionHotkey } from "./NewSessionLayer/useNewSessionHotkey";
import { useNewSessionRequest } from "./NewSessionLayer/useNewSessionRequest";

export function NewSessionLayer({
	launchers,
}: {
	launchers: NewSessionLaunchers;
}) {
	const [open, setOpen] = useState(false);
	const [opens, setOpens] = useState(0);
	const draft = useNewSessionDraft(opens);
	const openDialog = useCallback(() => {
		setOpen(true);
		setOpens((count) => count + 1);
	}, []);
	useNewSessionHotkey(openDialog);
	useNewSessionRequest(draft, openDialog);

	if (!open || !draft) return null;
	return (
		<NewSessionDialog
			draft={draft}
			launchers={launchers}
			onClose={() => setOpen(false)}
		/>
	);
}
