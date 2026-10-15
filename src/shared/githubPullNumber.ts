const PULL_PATH = /^\/[^/]+\/[^/]+\/pull\/(\d+)(?:\/|$)/;

export function githubPullNumber(url: string): string | undefined {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return undefined;
	}
	return PULL_PATH.exec(parsed.pathname)?.[1];
}
