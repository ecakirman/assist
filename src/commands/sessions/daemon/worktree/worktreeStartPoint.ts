import { gitOrNull } from "./git";
import { cloneHead } from "./cloneHead";
import { remoteDefaultBranch } from "./remoteDefaultBranch";

type StartPoint = { ref: string; track: boolean };

export async function worktreeStartPoint(
	clone: string,
	trunk: boolean,
): Promise<StartPoint> {
	const branch = trunk
		? await cloneTrunkBranch(clone)
		: await remoteDefaultBranch(clone);
	const ref = `origin/${branch}`;
	if (await gitOrNull(clone, ["rev-parse", "--verify", "--quiet", ref]))
		return { ref, track: trunk };
	return { ref: "HEAD", track: false };
}

async function cloneTrunkBranch(clone: string): Promise<string> {
	return (await cloneHead(clone)) ?? remoteDefaultBranch(clone);
}
