export type BrowserRequest = { op: "status"; url?: string };

type BrowserStatus = { tabUrl: string; contentScript: boolean };

export type BrowserReply =
	| { ok: true; result: BrowserStatus }
	| { ok: false; error: string; tabUrl?: string };

export type BrowserRelayRequest = BrowserRequest & {
	type: "request";
	id: string;
};

export type BrowserLinkMessage =
	| { type: "hello"; version: string }
	| (BrowserReply & { type: "response"; id: string });

export type BrowserRelayReply = BrowserReply & { version: string };

export const BROWSER_PROBE_TYPE = "assist-browser-probe";

export const BROWSER_LINK_PATH = "/ws/browser";
