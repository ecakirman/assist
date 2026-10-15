import { runGhOrThrow } from "../../../shared/runGhOrThrow";

export function postHighLevelApproval(
	repo: string,
	prNumber: number,
	body: string,
): void {
	const args = ["pr", "review", String(prNumber), "--repo", repo, "--approve"];
	if (body) args.push("--body", body);
	runGhOrThrow(args, `Could not approve ${repo}#${prNumber}`);
}
