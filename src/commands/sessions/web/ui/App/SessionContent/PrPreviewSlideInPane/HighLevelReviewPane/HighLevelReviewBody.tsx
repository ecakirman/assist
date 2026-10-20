import type { ComponentProps } from "react";
import type { HighLevelPreviewPayload } from "../../../../../../../review/highLevel/types";
import { HighLevelChecklistBody } from "./HighLevelReviewBody/HighLevelChecklistBody";
import { HighLevelHeadSourceProvider } from "./HighLevelReviewBody/HighLevelHeadSourceProvider";

export function HighLevelReviewBody({
	payload,
	...body
}: Omit<ComponentProps<typeof HighLevelChecklistBody>, "checks"> & {
	payload: HighLevelPreviewPayload;
}) {
	return (
		<HighLevelHeadSourceProvider repo={payload.repo} headSha={payload.headSha}>
			<HighLevelChecklistBody checks={payload.checks} {...body} />
		</HighLevelHeadSourceProvider>
	);
}
