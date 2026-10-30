import type { AssistClonesResult } from "./isAssistClonesMessage";

export async function fetchAssistClones(
	server: string,
): Promise<AssistClonesResult> {
	let response: Response;
	try {
		response = await fetch(`${server}/api/clones`);
	} catch {
		return { ok: false, message: `assist web server unreachable at ${server}` };
	}
	const data = (await response.json().catch(() => ({}))) as {
		clones?: unknown;
		error?: string;
	};
	if (!response.ok || !Array.isArray(data.clones))
		return {
			ok: false,
			message: data.error ?? `assist web server returned ${response.status}`,
		};
	return {
		ok: true,
		clones: data.clones.filter((clone) => typeof clone === "string"),
	};
}
