import type { AssistSendResult } from "./isAssistSendMessage";
import { extensionRuntime } from "./extensionRuntime";

type RuntimeFailure = { ok: false; message: string };

export async function sendRuntimeMessage<
	T extends { ok: boolean } = AssistSendResult,
>(message: unknown): Promise<T | RuntimeFailure> {
	const runtime = extensionRuntime();
	if (!runtime)
		return { ok: false, message: "assist extension runtime unavailable" };
	try {
		const result = (await runtime.sendMessage(message)) as T | undefined;
		return result ?? { ok: false, message: "assist extension did not reply" };
	} catch (error) {
		return {
			ok: false,
			message: error instanceof Error ? error.message : String(error),
		};
	}
}
