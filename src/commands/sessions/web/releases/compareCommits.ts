import { ghJson } from "./ghJson";
import { mainlineCommits } from "./mainlineCommits";
import { mergedPullRequests } from "./mergedPullRequests";
import { newestCommits } from "./newestCommits";
import {
	API_COMMIT_JQ,
	type ApiCommit,
	toReleaseCompareCommit,
} from "./toReleaseCompareCommit";
import type { ReleaseChange, ReleaseCompare } from "./types";

const MAX_CHANGES = 50;

async function rangeCommits(
	cwd: string,
	repo: string,
	base: string | null,
	head: string,
): Promise<ApiCommit[]> {
	if (base) return newestCommits(cwd, repo, `${base}...${head}`);
	const commit = await ghJson<ApiCommit>(cwd, [
		"api",
		`repos/${repo}/commits/${head}`,
		"--jq",
		API_COMMIT_JQ,
	]);
	return [commit];
}

export async function compareCommits(
	cwd: string,
	repo: string,
	base: string | null,
	head: string,
): Promise<ReleaseCompare> {
	const mainline = mainlineCommits(await rangeCommits(cwd, repo, base, head));
	const shown = mainline.slice(0, MAX_CHANGES);
	const prs = await mergedPullRequests(
		cwd,
		repo,
		shown.map((commit) => commit.sha),
	);
	const changes = shown.map((commit): ReleaseChange => {
		const change = toReleaseCompareCommit(commit);
		const pr = prs.get(commit.sha);
		if (!pr) return { ...change, pr: null };
		return {
			...change,
			subject: pr.title,
			author: pr.author ?? change.author,
			pr: { number: pr.number, url: pr.url },
		};
	});
	return { total: mainline.length, changes };
}
