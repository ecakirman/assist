const PROJECT_PATH = /^\/(?:orgs|users)\/[^/]+\/projects\/\d+(?:\/|$)/;
const PANE_ITEM = /^([\w.-]+)\|([\w.-]+)\|(\d+)$/;

export type ProjectPaneItem = { owner: string; repo: string; number: string };

export function projectPaneItem({
	pathname,
	search,
}: Pick<Location, "pathname" | "search">): ProjectPaneItem | undefined {
	if (!PROJECT_PATH.test(pathname)) return undefined;
	const params = new URLSearchParams(search);
	if (params.get("pane") !== "issue") return undefined;
	const match = PANE_ITEM.exec(params.get("issue") ?? "");
	if (!match) return undefined;
	const [, owner, repo, number] = match;
	return { owner, repo, number };
}
