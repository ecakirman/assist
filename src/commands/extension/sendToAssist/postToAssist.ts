import type {
	AssistSendMessage,
	AssistSendResult,
} from "./isAssistSendMessage";
import { postAssistJson } from "./postAssistJson";

export async function postToAssist(
	server: string,
	{ url, instructions, args, mode }: AssistSendMessage,
): Promise<AssistSendResult> {
	const [endpoint, body] = args
		? ["review-from-github", { url, args }]
		: ["from-github", { url, instructions, mode }];
	const result = await postAssistJson(
		server,
		`/api/sessions/${endpoint}`,
		body,
	);
	if (!result.ok) return result;
	return { ok: true, message: `assist session started in ${result.data.cwd}` };
}
