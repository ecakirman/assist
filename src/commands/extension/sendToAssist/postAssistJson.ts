type AssistJsonReply = { error?: string; cwd?: string; message?: string };

export async function postAssistJson(
	server: string,
	path: string,
	body: unknown,
): Promise<
	{ ok: true; data: AssistJsonReply } | { ok: false; message: string }
> {
	let response: Response;
	try {
		response = await fetch(`${server}${path}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
	} catch {
		return { ok: false, message: `assist web server unreachable at ${server}` };
	}
	const data = (await response.json().catch(() => ({}))) as AssistJsonReply;
	if (!response.ok)
		return {
			ok: false,
			message: data.error ?? `assist web server returned ${response.status}`,
		};
	return { ok: true, data };
}
