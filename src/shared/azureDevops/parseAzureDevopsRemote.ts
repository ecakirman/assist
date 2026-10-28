import { decodeUrlPart } from "./decodeUrlPart";

export type AzureDevopsRepo = { org: string; project: string; repo: string };

const HTTPS_DEV =
	/^https?:\/\/(?:[^@/]+@)?dev\.azure\.com\/([^/]+)\/([^/]+)\/_git\/([^/]+)$/i;
const HTTPS_VISUALSTUDIO =
	/^https?:\/\/(?:[^@/]+@)?([^./@]+)\.visualstudio\.com\/(?:DefaultCollection\/)?([^/]+)\/_git\/([^/]+)$/i;
const SSH =
	/^(?:ssh:\/\/)?[^@/]+@(?:ssh\.dev\.azure\.com|vs-ssh\.visualstudio\.com)(?::\d+)?[:/]v3\/([^/]+)\/([^/]+)\/([^/]+)$/i;

export function parseAzureDevopsRemote(raw: string): AzureDevopsRepo | null {
	const trimmed = raw
		.trim()
		.replace(/\/+$/, "")
		.replace(/\.git$/i, "");
	const match =
		HTTPS_DEV.exec(trimmed) ??
		HTTPS_VISUALSTUDIO.exec(trimmed) ??
		SSH.exec(trimmed);
	if (!match) return null;
	const [, org, project, repo] = match.map(decodeUrlPart);
	return { org, project, repo };
}
