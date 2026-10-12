import { ghJson } from "./ghJson";
import { API_COMMIT_JQ, type ApiCommit } from "./toReleaseCompareCommit";

const PAGE_SIZE = 100;
const MAX_PAGES = 3;

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
		`{total_commits, commits: [.commits[] | ${API_COMMIT_JQ}]}`,
	]);
}

export async function newestCommits(
	cwd: string,
	repo: string,
	range: string,
): Promise<ApiCommit[]> {
	const first = await comparePage(cwd, repo, range, 1);
	const last = Math.ceil(first.total_commits / PAGE_SIZE);
	if (last <= 1) return first.commits;
	const pages = Array.from(
		{ length: Math.min(MAX_PAGES, last) },
		(_, i) => last - i,
	).reverse();
	const tail = await Promise.all(
		pages.map((page) =>
			page === 1 ? first : comparePage(cwd, repo, range, page),
		),
	);
	return tail.flatMap((page) => page.commits);
}
