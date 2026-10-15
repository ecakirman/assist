export type AssistSendMessage = {
	type: "assist-send";
	url: string;
	instructions?: string;
};

export type AssistSendResult = { ok: boolean; message: string };

export function isAssistSendMessage(
	message: unknown,
): message is AssistSendMessage {
	const { type, url } = (message ?? {}) as Record<string, unknown>;
	return type === "assist-send" && typeof url === "string";
}
