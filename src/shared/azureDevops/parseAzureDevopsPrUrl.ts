import { decodeUrlPart } from "./decodeUrlPart";
import type { AzureDevopsRepo } from "./parseAzureDevopsRemote";

export type AzureDevopsPr = AzureDevopsRepo & { id: string; url: string };

const DEV_PATH =
	/^\/([^/]+)\/([^/]+)\/_git\/([^/]+)\/pullrequest\/([1-9]\d*)(?=\/|$)/i;
const VISUALSTUDIO_PATH =
	/^(?:\/DefaultCollection)?\/([^/]+)\/_git\/([^/]+)\/pullrequest\/([1-9]\d*)(?=\/|$)/i;
const VISUALSTUDIO_HOST = /^([^.]+)\.visualstudio\.com$/;

function matchPath(
	host: string,
	pathname: string,
): { path: string; parts: string[] } | null {
	if (host === "dev.azure.com") {
		const match = DEV_PATH.exec(pathname);
		return match && { path: match[0], parts: match.slice(1) };
	}
	const org = VISUALSTUDIO_HOST.exec(host)?.[1];
	const match = org ? VISUALSTUDIO_PATH.exec(pathname) : null;
	return match && org
		? { path: match[0], parts: [org, ...match.slice(1)] }
		: null;
}

export function parseAzureDevopsPrUrl(url: string): AzureDevopsPr | undefined {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return undefined;
	}
	if (parsed.protocol !== "https:") return undefined;
	const matched = matchPath(parsed.hostname.toLowerCase(), parsed.pathname);
	if (!matched) return undefined;
	const [org, project, repo, id] = matched.parts.map(decodeUrlPart);
	return { org, project, repo, id, url: `${parsed.origin}${matched.path}` };
}
