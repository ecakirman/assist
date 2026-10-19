import { useMemo } from "react";
import type { PrPreview } from "../../../../../../shared/SessionInfoBase";
import type { SessionInfo } from "../../../../types";
import { highLevelCheckDetails } from "./useHighLevelReviewPane/highLevelCheckDetails";
import { highLevelJumpCounts } from "./useHighLevelReviewPane/highLevelJumpCounts";
import { parseHighLevelPreview } from "./useHighLevelReviewPane/parseHighLevelPreview";
import { useHighLevelChecklist } from "./useHighLevelChecklist";
import { useHighLevelDiffComments } from "./useHighLevelReviewPane/useHighLevelDiffComments";
import { useHighLevelReviewQueue } from "./useHighLevelReviewPane/useHighLevelReviewQueue";

export function useHighLevelReviewPane(
	preview: PrPreview,
	session: SessionInfo | undefined,
	sendInput: ((sessionId: string, data: string) => void) | undefined,
) {
	const payload = useMemo(
		() => parseHighLevelPreview(preview.body),
		[preview.body],
	);
	const checklist = useHighLevelChecklist(payload.checks, payload.saved);
	const queue = useHighLevelReviewQueue(payload.saved);
	const { comments, sentTo, clearSent } = useHighLevelDiffComments(
		session,
		sendInput,
	);
	const details = highLevelCheckDetails(payload, {
		...comments,
		onQueue: queue.onQueue,
	});

	const counts = useMemo(() => highLevelJumpCounts(payload), [payload]);

	return { payload, checklist, queue, details, counts, sentTo, clearSent };
}
