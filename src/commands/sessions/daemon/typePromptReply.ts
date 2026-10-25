import type { TypePromptResult } from "./typePromptIntoSession";

export type TypePromptReply = { ok: boolean; message: string };

export function typePromptReply(
	id: string,
	result: TypePromptResult,
): TypePromptReply {
	if ("refused" in result) return { ok: false, message: result.refused };
	return {
		ok: true,
		message: result.queued
			? `Queued for assist session ${id}: it is waiting on a prompt, and gets this once that is answered`
			: `Sent to assist session ${id}`,
	};
}
