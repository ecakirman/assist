import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import { useState } from "react";
import type { PrSummary } from "../../../../prList";
import type { SessionInfo } from "../../../types";
import { ActionButton } from "../../ActionButton";
import { ReviewButtonMenu } from "./ReviewButton/ReviewButtonMenu";
import { useOpenHighLevelReview } from "./ReviewButton/useOpenHighLevelReview";
import { useReviewLaunch } from "./ReviewButton/useReviewLaunch";

export function ReviewButton({
	cwd,
	pr,
	session,
}: {
	cwd: string;
	pr: PrSummary;
	session?: SessionInfo;
}) {
	const review = useReviewLaunch(cwd, pr, session?.id);
	const openHighLevel = useOpenHighLevelReview(session, pr);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	return (
		<>
			<ActionButton
				label="Review"
				title="Review PR"
				icon={<RateReviewOutlinedIcon sx={{ fontSize: 14 }} />}
				onClick={(e) => {
					e.stopPropagation();
					review.resetOptions();
					setAnchorEl(e.currentTarget);
				}}
			/>
			<ReviewButtonMenu
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				review={review}
				openHighLevel={openHighLevel}
			/>
		</>
	);
}
