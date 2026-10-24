import { GithubIssueLink } from "../../../../../../../../../../../backlog/web/ui/components/GithubIssueLink";
import type { ItemTracker } from "../../../../../../../../../../../backlog/web/ui/types";
import type { CardToken } from "./CardToken";
import { trackerShowsIssue } from "./promptIssueToken/trackerShowsIssue";

export function promptIssueToken(
	promptIssue: string | undefined,
	tracker: ItemTracker | undefined,
): CardToken | undefined {
	if (!promptIssue || trackerShowsIssue(tracker, promptIssue)) return undefined;
	return {
		key: "prompt-issue",
		node: <GithubIssueLink githubIssue={promptIssue} variant="token" />,
	};
}
