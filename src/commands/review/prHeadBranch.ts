import { execFileSync } from "node:child_process";
import type { PrCliCommands } from "./prCliCommands";

export function prHeadBranch({
	headBranch,
}: Pick<PrCliCommands, "headBranch">): string | null {
	try {
		return headBranch.parse(
			execFileSync(headBranch.file, headBranch.args, {
				encoding: "utf8",
				stdio: ["ignore", "pipe", "pipe"],
			}),
		);
	} catch {
		return null;
	}
}
