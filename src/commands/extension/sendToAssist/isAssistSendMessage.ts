export type AssistSendMessage = {
	type: "assist-send";
	url: string;
	instructions?: string;
	args?: string[];
};

export type AssistSendResult = { ok: boolean; message: string };

export function isAssistSendMessage(
	message: unknown,
): message is AssistSendMessage {
	const { type, url, args } = (message ?? {}) as Record<string, unknown>;
	return (
		type === "assist-send" &&
		typeof url === "string" &&
		(args === undefined ||
			(Array.isArray(args) && args.every((arg) => typeof arg === "string")))
	);
}
