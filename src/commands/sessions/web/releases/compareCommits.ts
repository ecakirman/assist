import { ghJson } from "./ghJson";
import { newestCommits } from "./newestCommits";
import {
	type ApiCommit,
	toReleaseCompareCommit,
} from "./toReleaseCompareCommit";
import type { ReleaseCompare } from "./types";

export async function compareCommits(
	cwd: string,
	repo: string,
	base: string | null,
	head: string,
): Promise<ReleaseCompare> {
	if (!base) {
		const commit = await ghJson<ApiCommit>(cwd, [
			"api",
			`repos/${repo}/commits/${head}`,
			"--jq",
			"{sha, commit}",
		]);
		return { total: 1, commits: [toReleaseCompareCommit(commit)] };
	}
	const { total, commits } = await newestCommits(
		cwd,
		repo,
		`${base}...${head}`,
	);
	return { total, commits: commits.reverse() };
}
