import { gitOrNull } from "./git";
import { cloneHead } from "./cloneHead";

export async function remoteDefaultBranch(clone: string): Promise<string> {
	const head = await gitOrNull(clone, [
		"symbolic-ref",
		"--short",
		"refs/remotes/origin/HEAD",
	]);
	if (!head) return (await cloneHead(clone)) ?? "main";
	const slash = head.indexOf("/");
	return slash === -1 ? head : head.slice(slash + 1);
}
