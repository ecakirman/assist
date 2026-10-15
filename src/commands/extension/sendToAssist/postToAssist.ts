import type {
	AssistSendMessage,
	AssistSendResult,
} from "./isAssistSendMessage";

export async function postToAssist(
	server: string,
	{ url, instructions, args }: AssistSendMessage,
): Promise<AssistSendResult> {
	const [endpoint, body] = args
		? ["review-from-github", { url, args }]
		: ["from-github", { url, instructions }];
	let response: Response;
	try {
		response = await fetch(`${server}/api/sessions/${endpoint}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
	} catch {
		return { ok: false, message: `assist web server unreachable at ${server}` };
	}
	const data = (await response.json().catch(() => ({}))) as {
		error?: string;
		cwd?: string;
	};
	if (!response.ok)
		return {
			ok: false,
			message: data.error ?? `assist web server returned ${response.status}`,
		};
	return { ok: true, message: `assist session started in ${data.cwd}` };
}
