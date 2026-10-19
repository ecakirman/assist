import { execFileSync } from "node:child_process";

export function runGhOrThrow(
	args: string[],
	fallbackMessage: string,
	input?: string,
): void {
	try {
		execFileSync("gh", args, {
			stdio: [input === undefined ? "ignore" : "pipe", "ignore", "pipe"],
			encoding: "utf8",
			...(input === undefined ? {} : { input }),
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
