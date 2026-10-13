import { execSync } from "node:child_process";

type HighLevelPr = {
	title: string;
	body: string;
	headRef: string;
	headSha: string;
	linkedIssues: string[];
};

export function fetchHighLevelPr(
	prNumber: number,
	repo: { org: string; repo: string },
): HighLevelPr {
	const raw = execSync(
		`gh pr view ${prNumber} --json title,body,headRefName,headRefOid,closingIssuesReferences -R ${repo.org}/${repo.repo}`,
		{ encoding: "utf8" },
	);
	const pr = JSON.parse(raw) as {
		title: string | null;
		body: string | null;
		headRefName: string;
		headRefOid: string;
		closingIssuesReferences: {
			number: number;
			repository: { name: string; owner: { login: string } };
		}[];
	};
	return {
		title: pr.title ?? "",
		body: pr.body ?? "",
		headRef: pr.headRefName,
		headSha: pr.headRefOid,
		linkedIssues: pr.closingIssuesReferences.map(
			(issue) =>
				`${issue.repository.owner.login}/${issue.repository.name}#${issue.number}`,
		),
	};
}
