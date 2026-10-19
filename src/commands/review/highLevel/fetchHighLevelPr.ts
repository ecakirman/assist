import { execSync } from "node:child_process";
import type { PrMergeable } from "./types";
import { waitForMergeable } from "./waitForMergeable";

type HighLevelPr = {
	title: string;
	body: string;
	headRef: string;
	headSha: string;
	baseRef: string;
	mergeable: PrMergeable;
	linkedIssues: string[];
};

function ghPrView<T>(
	prNumber: number,
	repo: { org: string; repo: string },
	fields: string,
): T {
	const raw = execSync(
		`gh pr view ${prNumber} --json ${fields} -R ${repo.org}/${repo.repo}`,
		{ encoding: "utf8" },
	);
	return JSON.parse(raw) as T;
}

export function fetchHighLevelPr(
	prNumber: number,
	repo: { org: string; repo: string },
): HighLevelPr {
	const pr = ghPrView<{
		title: string | null;
		body: string | null;
		headRefName: string;
		headRefOid: string;
		baseRefName: string;
		mergeable: PrMergeable;
		closingIssuesReferences: {
			number: number;
			repository: { name: string; owner: { login: string } };
		}[];
	}>(
		prNumber,
		repo,
		"title,body,headRefName,headRefOid,baseRefName,mergeable,closingIssuesReferences",
	);
	return {
		title: pr.title ?? "",
		body: pr.body ?? "",
		headRef: pr.headRefName,
		headSha: pr.headRefOid,
		baseRef: pr.baseRefName,
		mergeable: waitForMergeable(
			pr.mergeable,
			() =>
				ghPrView<{ mergeable: PrMergeable }>(prNumber, repo, "mergeable")
					.mergeable,
		),
		linkedIssues: pr.closingIssuesReferences.map(
			(issue) =>
				`${issue.repository.owner.login}/${issue.repository.name}#${issue.number}`,
		),
	};
}
