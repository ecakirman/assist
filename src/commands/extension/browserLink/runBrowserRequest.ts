import { browserApi } from "./browserApi";
import { isAssistHost } from "./isAssistHost";
import { pickTargetTab } from "./pickTargetTab";
import {
	BROWSER_PROBE_TYPE,
	type BrowserReply,
	type BrowserRequest,
} from "./types";

const ASSIST_HOSTS =
	"github.com, dev.azure.com, *.visualstudio.com, localhost, 127.0.0.1";

export async function runBrowserRequest(
	request: BrowserRequest,
): Promise<BrowserReply> {
	const api = browserApi();
	if (!api) return { ok: false, error: "browser tabs API unavailable" };
	const [tabs, focused] = await Promise.all([
		api.tabs.query({}),
		api.windows?.getLastFocused().catch(() => undefined),
	]);
	const tab = pickTargetTab(tabs, focused?.id, request.url);
	if (!tab || tab.id === undefined)
		return {
			ok: false,
			error: request.url
				? `no open tab has a URL containing "${request.url}"`
				: "no active tab found",
		};
	const tabUrl = tab.url;
	if (!tabUrl || !isAssistHost(tabUrl))
		return {
			ok: false,
			tabUrl,
			error: `the target tab is not on an assist host (${ASSIST_HOSTS})`,
		};
	const contentScript = await api.tabs
		.sendMessage(tab.id, { type: BROWSER_PROBE_TYPE, op: request.op })
		.then(
			(reply) => (reply as { running?: boolean } | undefined)?.running === true,
		)
		.catch(() => false);
	return { ok: true, result: { tabUrl, contentScript } };
}
