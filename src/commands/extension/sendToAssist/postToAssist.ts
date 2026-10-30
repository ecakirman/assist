import type {
	AssistSendMessage,
	AssistSendResult,
} from "./isAssistSendMessage";
import { postAssistJson } from "./postAssistJson";

function endpointFor({
	url,
	instructions,
	args,
	mode,
	repo,
}: AssistSendMessage): [string, unknown] {
	if (args) return ["review-from-github", { url, args }];
	if (repo !== undefined)
		return ["from-link", { url, repo, instructions, mode }];
	return ["from-github", { url, instructions, mode }];
}

export async function postToAssist(
	server: string,
	message: AssistSendMessage,
): Promise<AssistSendResult> {
	const [endpoint, body] = endpointFor(message);
	const result = await postAssistJson(
		server,
		`/api/sessions/${endpoint}`,
		body,
	);
	if (!result.ok) return result;
	return { ok: true, message: `assist session started in ${result.data.cwd}` };
}
