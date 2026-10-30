export type AssistClonesResult =
	| { ok: true; clones: string[] }
	| { ok: false; message: string };

export function isAssistClonesMessage(message: unknown): boolean {
	return (message as { type?: unknown } | null)?.type === "assist-clones";
}
