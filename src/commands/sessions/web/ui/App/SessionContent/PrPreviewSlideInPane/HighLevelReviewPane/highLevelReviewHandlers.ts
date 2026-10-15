import type { PreviewChecklistItem } from "../../../../../../shared/PreviewDecision";
import type { PrDecisionDetails } from "../../../../PrDecisionDetails";
import { highLevelDecisionDetails } from "./highLevelReviewHandlers/highLevelDecisionDetails";

export function highLevelReviewHandlers(
	checklist: () => PreviewChecklistItem[],
	onDecision: (
		decision: "approve" | "reject",
		details: PrDecisionDetails,
	) => void,
) {
	const details = () => highLevelDecisionDetails(checklist());
	return {
		onApprove: () => onDecision("approve", details()),
		onRequestChanges: () => onDecision("reject", details()),
		onClose: () => onDecision("reject", { ...details(), dismissed: true }),
	};
}
