import { ghJson } from "./ghJson";
import {
	type ApiCommit,
	toReleaseCompareCommit,
} from "./toReleaseCompareCommit";
import type { ReleaseCompare } from "./types";

const PAGE_SIZE = 50;

type ComparePage = { total_commits: number; commits: ApiCommit[] };

function comparePage(
	cwd: string,
	repo: string,
	range: string,
	page: number,
): Promise<ComparePage> {
	return ghJson<ComparePage>(cwd, [
		"api",
		`repos/${repo}/compare/${range}?per_page=${PAGE_SIZE}&page=${page}`,
		"--jq",
		"{total_commits, commits: [.commits[] | {sha, commit}]}",
	]);
}

export async function newestCommits(
	cwd: string,
	repo: string,
	range: string,
): Promise<ReleaseCompare> {
	const first = await comparePage(cwd, repo, range, 1);
	const total = first.total_commits;
	if (total <= PAGE_SIZE)
		return { total, commits: first.commits.map(toReleaseCompareCommit) };
	const last = Math.ceil(total / PAGE_SIZE);
	const tail = await Promise.all(
		[last - 1, last].map((page) =>
			page === 1 ? first : comparePage(cwd, repo, range, page),
		),
	);
	const commits = tail.flatMap((page) => page.commits).slice(-PAGE_SIZE);
	return { total, commits: commits.map(toReleaseCompareCommit) };
}
