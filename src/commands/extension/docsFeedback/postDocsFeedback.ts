import type { AssistSendResult } from "../sendToAssist/isAssistSendMessage";
import { postAssistJson } from "../sendToAssist/postAssistJson";
import type { DocsFeedbackMessage } from "./isDocsFeedbackMessage";

export async function postDocsFeedback(
	server: string,
	{ type: _type, ...feedback }: DocsFeedbackMessage,
): Promise<AssistSendResult> {
	const result = await postAssistJson(
		server,
		"/api/sessions/docs-feedback",
		feedback,
	);
	if (!result.ok) return result;
	return {
		ok: true,
		message: result.data.message ?? "Sent to the docs session",
	};
}
