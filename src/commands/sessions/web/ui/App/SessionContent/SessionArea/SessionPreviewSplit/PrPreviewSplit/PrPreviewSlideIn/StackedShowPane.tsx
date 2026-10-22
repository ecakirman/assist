import Box from "@mui/material/Box";
import type { PrPreview } from "../../../../../../../../shared/SessionInfoBase";
import type { PrDecisionDetails } from "../../../../../../PrDecisionDetails";
import { miroDecisionDetails } from "../../../../miroDecisionDetails";
import { ShowPane } from "../../../../ShowPane";

export function StackedShowPane({
	show,
	onDecision,
}: {
	show: PrPreview;
	onDecision: (
		requestId: string,
		decision: "approve" | "reject",
		details: PrDecisionDetails,
	) => void;
}) {
	return (
		<Box sx={{ position: "absolute", inset: 0, display: "flex" }}>
			<ShowPane
				key={show.requestId}
				preview={show}
				onClose={() =>
					onDecision(show.requestId, "reject", miroDecisionDetails())
				}
			/>
		</Box>
	);
}
