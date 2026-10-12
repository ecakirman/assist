import { ghJson } from "./ghJson";
import { pullRequestsQuery } from "./pullRequestsQuery";

type MergedPullRequest = {
	number: number;
	title: string;
	url: string;
	author: string | null;
};

type PullRequestNode = {
	number: number;
	title: string;
	url: string;
	author?: { login?: string | null } | null;
	mergeCommit?: { oid?: string | null } | null;
};

type PullRequestsResponse = {
	data?: {
		repository?: Record<
			string,
			{ associatedPullRequests?: { nodes?: PullRequestNode[] | null } } | null
		> | null;
	};
};

export async function mergedPullRequests(
	cwd: string,
	repo: string,
	shas: string[],
): Promise<Map<string, MergedPullRequest>> {
	const merged = new Map<string, MergedPullRequest>();
	const [owner, name] = repo.split("/");
	if (shas.length === 0 || !owner || !name) return merged;
	const response = await ghJson<PullRequestsResponse>(cwd, [
		"api",
		"graphql",
		"-f",
		`query=${pullRequestsQuery(shas)}`,
		"-f",
		`owner=${owner}`,
		"-f",
		`name=${name}`,
	]);
	const repository = response.data?.repository;
	for (const [index, sha] of shas.entries()) {
		const nodes = repository?.[`c${index}`]?.associatedPullRequests?.nodes;
		const pr = nodes?.find((node) => node.mergeCommit?.oid === sha);
		if (pr)
			merged.set(sha, {
				number: pr.number,
				title: pr.title,
				url: pr.url,
				author: pr.author?.login ?? null,
			});
	}
	return merged;
}
