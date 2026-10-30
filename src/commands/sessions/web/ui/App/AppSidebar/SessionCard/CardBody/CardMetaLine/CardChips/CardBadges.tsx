import Box from "@mui/material/Box";
import { CloneBadge } from "./CardBadges/CloneBadge";
import { tokenBadgeSx } from "../../../../../../designSystem/tokenBadgeSx";
import { HarnessBadge } from "../../../../HarnessBadge";
import { NodeBadge } from "../../../../NodeBadge";
import { ServingChip } from "./CardBadges/ServingChip";
import type { SessionInfo } from "../../../../../../types";
import { useCloneBadgeContext } from "../../../../useCloneBadgeContext";

const reviewPhaseSx = tokenBadgeSx("primary");

function ReviewPhaseBadge({ label }: { label: string }) {
	return (
		<Box component="span" sx={reviewPhaseSx}>
			{label}
		</Box>
	);
}

export function CardBadges({ session }: { session: SessionInfo }) {
	const badgeClone = useCloneBadgeContext().has(session.id);
	const clone = session.repoGroup?.clone;
	const { activity } = session;
	const inReview =
		activity?.kind === "backlog" && activity.phase === activity.totalPhases;

	return (
		<>
			<ServingChip session={session} />
			<HarnessBadge harness={session.harness} />
			{badgeClone && clone && <CloneBadge clone={clone} />}
			<NodeBadge node={session.node} />
			{inReview && (
				<ReviewPhaseBadge label={`${activity.phase}/${activity.totalPhases}`} />
			)}
		</>
	);
}
