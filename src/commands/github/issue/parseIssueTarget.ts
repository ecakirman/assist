import { resolveIssueRepoTarget } from "./resolveIssueRepoTarget";

type IssueTarget = {
	owner: string;
	repo: string;
	number: number;
	slug: string;
};

export function parseIssueTarget(
	numberArg: string,
	repoOption: string | undefined,
	usage: string,
): IssueTarget {
	const number = Number.parseInt(numberArg, 10);
	if (!Number.isInteger(number) || number <= 0) {
		console.error(usage);
		process.exit(1);
	}

	const { owner, repo } = resolveIssueRepoTarget(repoOption);
	return { owner, repo, number, slug: `${owner}/${repo}` };
}
