import type { ReactNode } from "react";
import { AssistPopover } from "../sendToAssist/AssistPopover";

export function docsFeedbackPopover(
	send: (prompt: string) => void,
	dismiss: (restoreFocus: boolean) => void,
): ReactNode {
	return (
		<AssistPopover
			placeholder="Feedback on the selected text"
			onSend={(prompt) => {
				if (!prompt.trim()) return;
				dismiss(false);
				send(prompt);
			}}
			onClose={dismiss}
		/>
	);
}
