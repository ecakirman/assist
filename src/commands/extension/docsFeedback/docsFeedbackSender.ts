import { showAssistToast } from "../sendToAssist/showAssistToast";
import type { DocsSelection } from "./readDocsSelection";
import { sendDocsFeedback } from "./sendDocsFeedback";

export function docsFeedbackSender(
	selection: DocsSelection,
	onSent: () => void,
) {
	return async (prompt: string) => {
		const result = await sendDocsFeedback(selection, prompt);
		if (result.ok) {
			onSent();
			showAssistToast(result.message, true);
		}
		return result;
	};
}
