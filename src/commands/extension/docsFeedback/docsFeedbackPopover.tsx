import { type ReactNode, useState } from "react";
import { AssistPopover } from "../sendToAssist/AssistPopover";
import type { AssistSendResult } from "../sendToAssist/isAssistSendMessage";

type Send = (prompt: string) => Promise<AssistSendResult>;
type Dismiss = (restoreFocus: boolean) => void;

function DocsFeedbackPopover({
	send,
	dismiss,
	unsent,
}: {
	send: Send;
	dismiss: Dismiss;
	unsent: string;
}) {
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string>();

	const onSend = async (prompt: string) => {
		if (!prompt.trim()) return;
		setBusy(true);
		const result = await send(prompt);
		setBusy(false);
		if (result.ok) dismiss(false);
		else setError(result.message);
	};

	return (
		<AssistPopover
			placeholder="Feedback on the selected text"
			onSend={onSend}
			onClose={dismiss}
			initialText={unsent}
			error={error}
			busy={busy}
		/>
	);
}

export function docsFeedbackPopover(
	send: Send,
	dismiss: Dismiss,
	unsent = "",
): ReactNode {
	return <DocsFeedbackPopover send={send} dismiss={dismiss} unsent={unsent} />;
}
