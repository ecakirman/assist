import type { ReleaseCompareCommit } from "./types";

export type ApiCommit = {
	sha: string;
	commit?: {
		message?: string | null;
		author?: { name?: string | null } | null;
		committer?: { date?: string | null } | null;
	} | null;
};

export function toReleaseCompareCommit({
	sha,
	commit,
}: ApiCommit): ReleaseCompareCommit {
	return {
		sha,
		subject: commit?.message?.split("\n")[0] ?? null,
		author: commit?.author?.name ?? null,
		date: commit?.committer?.date ?? null,
	};
}
