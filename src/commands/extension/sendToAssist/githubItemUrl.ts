import { paneItemIsPull } from "./paneItemIsPull";
import { type ProjectPaneItem, projectPaneItem } from "./projectPaneItem";

const ITEM_PATH = /^\/([^/]+)\/([^/]+)\/(pull|issues)\/(\d+)(?:\/|$)/;

export function githubItemUrl(
	location: Pick<Location, "origin" | "pathname" | "search">,
	isPull: (item: ProjectPaneItem) => boolean = paneItemIsPull,
): string | undefined {
	const match = ITEM_PATH.exec(location.pathname);
	if (match) {
		const [, owner, repo, kind, number] = match;
		return `${location.origin}/${owner}/${repo}/${kind}/${number}`;
	}
	const item = projectPaneItem(location);
	if (!item) return undefined;
	const kind = isPull(item) ? "pull" : "issues";
	return `${location.origin}/${item.owner}/${item.repo}/${kind}/${item.number}`;
}
