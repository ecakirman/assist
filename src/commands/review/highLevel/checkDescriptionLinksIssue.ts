import type { CheckOutcome } from "./types";

const ISSUE_URL_PATTERN =
	/https?:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/\d+/g;
const CROSS_REPO_PATTERN = /\b[\w.-]+\/[\w.-]+#\d+/g;
const SAME_REPO_PATTERN = /(?<![\w/#-])#\d+\b/g;

function firstMatch(body: string, pattern: RegExp): string | null {
	return body.match(pattern)?.[0] ?? null;
}

export function checkDescriptionLinksIssue(
	body: string,
	linkedIssues: string[],
): CheckOutcome {
	if (linkedIssues[0])
		return {
			status: "pass",
			reason: `Development-linked to ${linkedIssues[0]}`,
		};
	const reference =
		firstMatch(body, ISSUE_URL_PATTERN) ??
		firstMatch(body, CROSS_REPO_PATTERN) ??
		firstMatch(body, SAME_REPO_PATTERN);
	if (!reference)
		return {
			status: "fail",
			reason:
				"no GitHub issue reference (`#123`, `owner/repo#123`, or an issue URL) in the description and no Development-linked issue",
		};
	return { status: "pass", reason: `links ${reference}` };
}
