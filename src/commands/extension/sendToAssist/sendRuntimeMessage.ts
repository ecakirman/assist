import type { AssistSendResult } from "./isAssistSendMessage";
import { extensionRuntime } from "./extensionRuntime";

export async function sendRuntimeMessage(
	message: unknown,
): Promise<AssistSendResult> {
	const runtime = extensionRuntime();
	if (!runtime)
		return { ok: false, message: "assist extension runtime unavailable" };
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
