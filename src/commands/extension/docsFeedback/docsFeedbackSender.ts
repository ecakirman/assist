import { showAssistToast } from "../sendToAssist/showAssistToast";
import type { DocsSelection } from "./readDocsSelection";
import { sendDocsFeedback } from "./sendDocsFeedback";

export function docsFeedbackSender(
	selection: DocsSelection,
	onSent: () => void,
) {
	let unsent = "";
	const send = async (prompt: string) => {
		const result = await sendDocsFeedback(selection, prompt);
		unsent = result.ok ? "" : prompt;
		if (result.ok) {
			onSent();
			showAssistToast(result.message, true);
		}
		return result;
	};
	return { send, unsent: () => unsent };
}
