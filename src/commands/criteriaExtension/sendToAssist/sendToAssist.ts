import type {
	AssistSendMessage,
	AssistSendResult,
} from "./isAssistSendMessage";
import { extensionRuntime } from "./extensionRuntime";

export async function sendToAssist(
	url: string,
	instructions?: string,
): Promise<AssistSendResult> {
	const runtime = extensionRuntime();
	if (!runtime)
		return { ok: false, message: "assist extension runtime unavailable" };
	const message: AssistSendMessage = { type: "assist-send", url, instructions };
	try {
		const result = (await runtime.sendMessage(message)) as
			| AssistSendResult
			| undefined;
		return result ?? { ok: false, message: "assist extension did not reply" };
	} catch (error) {
		return {
			ok: false,
			message: error instanceof Error ? error.message : String(error),
		};
	}
}
