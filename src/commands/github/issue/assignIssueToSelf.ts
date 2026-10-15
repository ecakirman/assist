import { runGhOrThrow } from "../../../shared/runGhOrThrow";

export function assignIssueToSelf(number: number, repo: string): void {
	runGhOrThrow(
		["issue", "edit", String(number), "--repo", repo, "--add-assignee", "@me"],
		`Could not assign ${repo}#${number} to you`,
	);
}
