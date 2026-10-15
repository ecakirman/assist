const ITEM_PATH = /^\/([^/]+)\/([^/]+)\/(pull|issues)\/(\d+)(?:\/|$)/;

export function githubItemUrl({
	origin,
	pathname,
}: Pick<Location, "origin" | "pathname">): string | undefined {
	const match = ITEM_PATH.exec(pathname);
	if (!match) return undefined;
	const [, owner, repo, kind, number] = match;
	return `${origin}/${owner}/${repo}/${kind}/${number}`;
}
