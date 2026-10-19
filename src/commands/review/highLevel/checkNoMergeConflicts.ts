import type { CheckOutcome, PrMergeable } from "./types";

export function checkNoMergeConflicts(
	mergeable: PrMergeable,
	baseRef: string,
): CheckOutcome {
	if (mergeable === "MERGEABLE")
		return { status: "pass", reason: `merges cleanly into ${baseRef}` };
	if (mergeable === "CONFLICTING")
		return {
			status: "fail",
			reason: `branch has merge conflicts with ${baseRef}`,
		};
	return {
		status: "fail",
		reason: `GitHub could not determine whether the branch merges cleanly into ${baseRef}`,
	};
}
