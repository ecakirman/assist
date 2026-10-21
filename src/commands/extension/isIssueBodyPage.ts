import { paneItemIsPull } from "./sendToAssist/paneItemIsPull";
import {
	type ProjectPaneItem,
	projectPaneItem,
} from "./sendToAssist/projectPaneItem";

const ISSUE_BODY_PATH = /^\/[^/]+\/[^/]+\/issues\/(?:\d+|new)(?:\/|$)/;

/**
 * Whether a github.com page can hold an editable issue body — an existing
 * issue, the new-issue form, or a project pane showing an issue. Comment editors and pull
 * request bodies live elsewhere, so gating on the path keeps the toggle off
 * every other page.
 */
export function isIssueBodyPage(
	location: Pick<Location, "pathname" | "search">,
	isPull: (item: ProjectPaneItem) => boolean = paneItemIsPull,
): boolean {
	if (ISSUE_BODY_PATH.test(location.pathname)) return true;
	const item = projectPaneItem(location);
	return item !== undefined && !isPull(item);
}
