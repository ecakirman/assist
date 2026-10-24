import type {
	AssistSendMessage,
	AssistSendResult,
} from "./isAssistSendMessage";
import { sendRuntimeMessage } from "./sendRuntimeMessage";

export function sendToAssist(
	request: Omit<AssistSendMessage, "type">,
): Promise<AssistSendResult> {
	const message: AssistSendMessage = { type: "assist-send", ...request };
	return sendRuntimeMessage(message);
}
