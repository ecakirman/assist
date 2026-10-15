import { highLevelChangedFileCount } from "../../../../../../../../review/highLevel/highLevelChangedFileCount";
import { highLevelTestCount } from "../../../../../../../../review/highLevel/highLevelTestCount";
import type { HighLevelPreviewPayload } from "../../../../../../../../review/highLevel/types";

export function highLevelJumpCounts(
	payload: HighLevelPreviewPayload,
): Record<string, string> {
	const counts: [string, number, string][] = [
		[
			"structure-sensible",
			highLevelChangedFileCount(payload.structure),
			"file",
		],
		["critical-diffs-correct", payload.criticalDiffs.length, "diff"],
		["tests-worth-having", highLevelTestCount(payload.tests), "test"],
	];
	return Object.fromEntries(
		counts
			.filter(([, count]) => count > 0)
			.map(([id, count, noun]) => [
				id,
				`${count} ${noun}${count === 1 ? "" : "s"}`,
			]),
	);
}
