import type { ReleaseCommit } from "./types";

export type CommitNode = {
	oid?: string | null;
	messageHeadline?: string | null;
	author?: { name?: string | null } | null;
};

export function releaseCommit(
	sha: string,
	node: CommitNode | null,
): ReleaseCommit {
	return {
		sha,
		subject: node?.messageHeadline ?? null,
		author: node?.author?.name ?? null,
	};
}
