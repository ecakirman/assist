import type { BrowserOp, BrowserReply, ProbeAnswer } from "./types";

export function probeReply(
	op: BrowserOp,
	tabUrl: string,
	answer: ProbeAnswer | undefined,
): BrowserReply {
	const contentScript = answer?.running === true;
	if (op === "status") return { ok: true, result: { tabUrl, contentScript } };
	if (!contentScript)
		return {
			ok: false,
			tabUrl,
			error:
				"the assist content script is not running on the target tab (reload the tab, or update the extension)",
		};
	if (answer.error || !answer.result)
		return { ok: false, tabUrl, error: answer.error ?? "empty probe reply" };
	return { ok: true, result: { tabUrl, ...answer.result } } as BrowserReply;
}
