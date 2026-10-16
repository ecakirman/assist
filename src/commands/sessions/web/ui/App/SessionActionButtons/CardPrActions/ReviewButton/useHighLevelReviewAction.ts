import { useTheme } from "@mui/material/styles";
import type { PrSummary } from "../../../../../prList";
import type { ReviewOptions } from "../../../../../../../../shared/reviewOptionFlags";
import type { SessionInfo } from "../../../../types";
import { useSessionLaunchContext } from "../../../../useSessionLaunchContext";
import { sessionRegion } from "../../../sessionRegion";
import { focusRegion } from "../../../focusRegion";
import { pasteAndSubmit } from "../../../pasteAndSubmit";
import { hasPendingHighLevelReview } from "./useHighLevelReviewAction/hasPendingHighLevelReview";
import { isHighLevelReviewSession } from "./useHighLevelReviewAction/isHighLevelReviewSession";

export type HighLevelReviewAction = { label: string; run: () => void };

export function useHighLevelReviewAction(
	session: SessionInfo | undefined,
	pr: PrSummary,
	options: ReviewOptions,
): HighLevelReviewAction | undefined {
	const { activateSession, sendInput } = useSessionLaunchContext();
	const ringColor = useTheme().palette.primary.main;
	if (!session || !isHighLevelReviewSession(session, pr.number))
		return undefined;
	if (hasPendingHighLevelReview(session, pr.number))
		return {
			label: "Open high-level review",
			run: () => {
				activateSession(session.id);
				focusRegion(sessionRegion("preview", session.id), ringColor);
			},
		};
	const force = options.force ? " --force" : "";
	return {
		label: "Reopen high-level review",
		run: () =>
			pasteAndSubmit(
				sendInput,
				session.id,
				`/review-high-level ${pr.number}${force}`,
			),
	};
}
