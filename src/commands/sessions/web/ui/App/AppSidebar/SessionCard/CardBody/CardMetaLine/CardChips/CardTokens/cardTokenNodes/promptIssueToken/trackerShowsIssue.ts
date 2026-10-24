import type { ItemTracker } from "../../../../../../../../../../../../backlog/web/ui/types";

export function trackerShowsIssue(
	tracker: ItemTracker | undefined,
	issue: string,
): boolean {
	return (
		!tracker?.jiraKey &&
		tracker?.githubIssue?.toLowerCase() === issue.toLowerCase()
	);
}
