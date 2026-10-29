import { gitOrNull } from "./git";

export function cloneHead(clone: string): Promise<string | null> {
	return gitOrNull(clone, ["symbolic-ref", "--short", "HEAD"]);
}
