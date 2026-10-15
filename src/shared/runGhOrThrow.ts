import { execFileSync } from "node:child_process";

export function runGhOrThrow(args: string[], fallbackMessage: string): void {
	try {
		execFileSync("gh", args, {
			stdio: ["ignore", "ignore", "pipe"],
			encoding: "utf8",
		});
	} catch (error) {
		const stderr = (error as { stderr?: unknown }).stderr;
		throw new Error(
			typeof stderr === "string" && stderr.trim()
				? stderr.trim()
				: fallbackMessage,
		);
	}
}
