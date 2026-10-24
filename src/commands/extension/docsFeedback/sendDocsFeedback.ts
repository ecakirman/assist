import type { AssistSendResult } from "../sendToAssist/isAssistSendMessage";
import { sendRuntimeMessage } from "../sendToAssist/sendRuntimeMessage";
import type { DocsFeedbackMessage } from "./isDocsFeedbackMessage";
import type { DocsSelection } from "./readDocsSelection";

export function sendDocsFeedback(
	{ range: _range, ...selection }: DocsSelection,
	prompt: string,
): Promise<AssistSendResult> {
	const message: DocsFeedbackMessage = {
		type: "assist-docs-feedback",
		...selection,
		prompt,
	};
	return sendRuntimeMessage(message);
}
