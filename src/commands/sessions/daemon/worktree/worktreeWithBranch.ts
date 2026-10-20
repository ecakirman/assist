export function worktreeWithBranch(
	listing: string,
	branch: string,
): string | null {
	let path: string | null = null;
	for (const line of listing.split("\n")) {
		const trimmed = line.trim();
		if (trimmed.startsWith("worktree "))
			path = trimmed.slice("worktree ".length).trim();
		else if (trimmed === `branch refs/heads/${branch}`) return path;
	}
	return null;
}
