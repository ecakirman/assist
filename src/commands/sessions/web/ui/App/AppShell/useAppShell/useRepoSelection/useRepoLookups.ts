import { useCallback } from "react";
import { findRepo, LOCAL_NODE, type MergedRepo } from "../../../../mergeRepos";
import { nodeKey } from "../../../../nodeKey";
import type { RepoPick } from "./resolveSelectedNode";

export function useRepoLookups(
	merged: MergedRepo[],
	localNode: string | undefined,
	pick: RepoPick & { node: string },
) {
	const { cwd: pickCwd, node: pickNode, origin: pickOrigin } = pick;
	const cloneOn = useCallback(
		(cwd: string, node: string | undefined) => {
			const key = nodeKey(node, localNode);
			const repo = findRepo(merged, cwd);
			if (repo) return repo.clones[key];
			const owner = cwd === pickCwd ? pickNode : LOCAL_NODE;
			return key === owner ? cwd : undefined;
		},
		[merged, localNode, pickCwd, pickNode],
	);
	const originOf = useCallback(
		(cwd: string) =>
			findRepo(merged, cwd)?.origin ??
			(cwd === pickCwd ? pickOrigin : undefined),
		[merged, pickCwd, pickOrigin],
	);
	return { cloneOn, originOf };
}
