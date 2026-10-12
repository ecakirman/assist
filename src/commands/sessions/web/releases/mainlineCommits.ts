import type { ApiCommit } from "./toReleaseCompareCommit";

export function mainlineCommits(commits: ApiCommit[]): ApiCommit[] {
	const bySha = new Map(commits.map((commit) => [commit.sha, commit]));
	const mainline: ApiCommit[] = [];
	let commit = commits.at(-1);
	while (commit) {
		mainline.push(commit);
		const parent = commit.parents?.[0];
		commit = parent ? bySha.get(parent) : undefined;
	}
	return mainline;
}
