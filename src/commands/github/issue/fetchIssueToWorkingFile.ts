import { fetchIssue } from "./fetchIssue";
import { slugFromUrl } from "./slugFromUrl";
import { writeIssueWorkingFile } from "./writeIssueWorkingFile";

export function fetchIssueToWorkingFile(
	number: number,
	repo: string | undefined,
): void {
	const issue = fetchIssue(number, repo);
	const slug = repo ?? slugFromUrl(issue.url);
	const target = `${slug}#${number}`;
	const bodyPath = writeIssueWorkingFile(
		slug,
		number,
		target,
		issue.updatedAt,
		issue.body,
	);
	console.log(
		`Wrote the current body of ${target} to ${bodyPath}. Edit it in place, then run 'assist github issue edit ${number}${repo ? ` -R ${repo}` : ""}' to preview the revision.`,
	);
}
