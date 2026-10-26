import { nodeKey } from "../../../../../sessions/web/ui/nodeKey";
import type { RepoSelection } from "../../../../../sessions/web/ui/useRepoSelectionContext";

export function scopeSelectionToRoute(
	selection: RepoSelection,
	cwdParam: string | undefined,
	nodeParam: string | undefined,
	localNode: string | undefined,
): RepoSelection {
	if (!cwdParam) return selection;
	const owner = nodeKey(nodeParam, localNode);
	return {
		...selection,
		selectedCwd: cwdParam,
		selectedNode: nodeParam,
		cloneOn: (cwd, node) => {
			const clone = selection.cloneOn(cwd, node);
			if (cwd !== cwdParam || clone !== cwd) return clone;
			return nodeKey(node, localNode) === owner ? clone : undefined;
		},
	};
}
