import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { daemonLog } from "../daemonLog";
import { gitOrNull } from "./git";
import { prCheckoutNumber } from "./prCheckoutNumber";
import { worktreeWithBranch } from "./worktreeWithBranch";

function prHeadBranch(number: string, cwd: string): Promise<string | null> {
	return new Promise((resolve) => {
		execFile(
			"gh",
			["pr", "view", number, "--json", "headRefName", "-q", ".headRefName"],
			{ cwd, encoding: "utf8", windowsHide: true },
			(error, stdout) => resolve(error ? null : stdout.trim() || null),
		);
	});
}

export async function prCheckoutHolder(
	assistArgs: string[],
	cwd: string | undefined,
): Promise<string | undefined> {
	const number = prCheckoutNumber(assistArgs);
	if (!number || !cwd || !existsSync(cwd)) return undefined;
	const headRef = await prHeadBranch(number, cwd);
	if (!headRef) return undefined;
	const listing = await gitOrNull(cwd, ["worktree", "list", "--porcelain"]);
	const holder = listing ? worktreeWithBranch(listing, headRef) : null;
	if (!holder || !existsSync(holder)) return undefined;
	daemonLog(
		`pr #${number} assist ${assistArgs[0]} launched in its checkout ${holder}: head branch ${headRef} is already checked out there, so no worktree is allocated`,
	);
	return holder;
}
