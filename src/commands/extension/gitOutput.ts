import { execFileSync } from "node:child_process";

export function gitOutput(args: string[], env?: NodeJS.ProcessEnv): string {
	return execFileSync("git", args, {
		encoding: "utf8",
		env: { ...process.env, ...env },
	}).trim();
}
