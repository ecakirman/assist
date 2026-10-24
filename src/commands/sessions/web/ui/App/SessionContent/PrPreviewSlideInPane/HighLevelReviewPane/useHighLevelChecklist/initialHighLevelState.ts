import type {
	HighLevelCheckResult,
	HighLevelReviewProgress,
} from "../../../../../../../../review/highLevel/types";

export type HighLevelItemState = {
	ticked: boolean;
	comment: string;
};

export function initialHighLevelState(
	checks: HighLevelCheckResult[],
	saved: HighLevelReviewProgress | undefined,
): Record<string, HighLevelItemState> {
	return Object.fromEntries(
		checks.map((check) => {
			const previous = saved?.items.find((item) => item.id === check.id);
			return [
				check.id,
				{
					ticked: previous?.ticked ?? check.status === "pass",
					comment: previous?.comment ?? "",
				},
			];
		}),
	);
}
