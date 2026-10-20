import { gitSyncOrNull } from "../sessions/daemon/worktree/git";
import { worktreeWithBranch } from "../sessions/daemon/worktree/worktreeWithBranch";

export function worktreeHoldingBranch(
	cwd: string,
	branch: string,
): string | null {
	const listing = gitSyncOrNull(cwd, ["worktree", "list", "--porcelain"]);
	if (!listing) return null;
	const here = gitSyncOrNull(cwd, ["rev-parse", "--show-toplevel"]);
	const path = worktreeWithBranch(listing, branch);
	return path && path !== here ? path : null;
}
