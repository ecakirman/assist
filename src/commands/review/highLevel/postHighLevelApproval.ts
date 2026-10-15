import { execFileSync } from "node:child_process";

export function postHighLevelApproval(repo: string, prNumber: number): void {
	try {
		execFileSync(
			"gh",
			["pr", "review", String(prNumber), "--repo", repo, "--approve"],
			{ stdio: ["ignore", "ignore", "pipe"], encoding: "utf8" },
		);
	} catch (error) {
		const stderr = (error as { stderr?: unknown }).stderr;
		throw new Error(
			typeof stderr === "string" && stderr.trim()
				? stderr.trim()
				: `Could not approve ${repo}#${prNumber}`,
		);
	}
}
