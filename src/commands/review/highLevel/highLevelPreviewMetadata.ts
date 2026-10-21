import type { PreviewMetadata } from "../../sessions/shared/SessionInfoBase";
import type { HighLevelOverlaySubject } from "./HighLevelOverlaySubject";

export function highLevelPreviewMetadata(
	subject: HighLevelOverlaySubject,
): PreviewMetadata[] {
	return [
		{ label: "Branch", value: subject.headRef },
		{ label: "Head", value: subject.headSha.slice(0, 7) },
		...(subject.saved
			? [{ label: "Reopened from", value: subject.saved.reviewedAt }]
			: []),
	];
}
