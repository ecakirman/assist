import { execSync } from "node:child_process";

export function tryGit(args: string): string | null {
	try {
		return execSync(`git ${args}`, {
			encoding: "utf8",
			stdio: ["pipe", "pipe", "pipe"],
		}).trim();
	} catch {
		return null;
	}
}
