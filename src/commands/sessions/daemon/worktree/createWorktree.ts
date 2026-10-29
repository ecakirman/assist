import { existsSync } from "node:fs";
import { basename, dirname } from "node:path";
import { expandTilde } from "../../../../shared/expandTilde";
import { getCachedOrigin } from "../../../backlog/getCachedOrigin";
import { daemonLog } from "../daemonLog";
import { git, gitResult } from "./git";
import { listLocalBranches, listWorktreePaths } from "./listWorktreePaths";
import { nextWorktreePath } from "./nextWorktreePath";
import { recordWorktree } from "./readWorktreeRegistry";
import { worktreeStartPoint } from "./worktreeStartPoint";

const FETCH_TIMEOUT_MS = 60_000;

type CreatedWorktree = { path: string; ready: Promise<void> };

export function createWorktree(
	clone: string,
	strategy: { root: string | undefined; trunk: boolean },
	boundTreeRoots: Set<string>,
	preferredPath?: string,
): CreatedWorktree {
	const base = strategy.root ? expandTilde(strategy.root) : dirname(clone);
	const registered = new Set(listWorktreePaths(clone));
	const branches = new Set(listLocalBranches(clone));
	const isTaken = (candidate: string) =>
		registered.has(candidate) ||
		existsSync(candidate) ||
		boundTreeRoots.has(candidate) ||
		branches.has(basename(candidate));
	const path =
		preferredPath && !isTaken(preferredPath)
			? preferredPath
			: nextWorktreePath(clone, base, isTaken);
	const ready = addWorktree(clone, path, strategy.trunk);
	ready.catch(() => {});
	return { path, ready };
}

async function addWorktree(
	clone: string,
	path: string,
	trunk: boolean,
): Promise<void> {
	const fetched = await gitResult(
		clone,
		["fetch", "--quiet"],
		FETCH_TIMEOUT_MS,
	);
	if (!fetched.ok)
		daemonLog(
			`fetch before allocating a worktree for clone ${clone} failed, branching off local refs: ${fetched.error}`,
		);
	const start = await worktreeStartPoint(clone, trunk);
	await git(clone, [
		"worktree",
		"add",
		start.track ? "--track" : "--no-track",
		"-b",
		basename(path),
		path,
		start.ref,
	]);
	recordWorktree(path, clone, getCachedOrigin(clone));
	daemonLog(
		start.track
			? `worktree allocated ${path} (branch ${basename(path)} tracking ${start.ref}) for clone ${clone}`
			: `worktree allocated ${path} (branch ${basename(path)} off ${start.ref}, no mainline tracking) for clone ${clone}`,
	);
}
