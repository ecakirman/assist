import type { BacklogItem } from "../types";
import { ActivitySection } from "./ActivitySection";
import { CommentsSection } from "./CommentsSection";
import { PlanSection } from "./PlanSection";

export type ItemRelationsProps = {
	item: BacklogItem;
	onRewind?: () => Promise<void>;
	onCommentDeleted?: () => Promise<void>;
};

export function ItemRelations({
	item,
	onRewind,
	onCommentDeleted,
}: ItemRelationsProps) {
	return (
		<>
			{item.plan && (
				<PlanSection
					phases={item.plan}
					currentPhase={item.currentPhase}
					itemId={item.id}
					usage={item.phaseUsage}
					sessions={item.phaseSessions}
					onRewind={onRewind}
				/>
			)}
			<ActivitySection
				gitRefs={item.gitRefs ?? []}
				conversations={item.conversations}
			/>
			{item.comments && (
				<CommentsSection
					comments={item.comments}
					itemId={item.id}
					onCommentDeleted={onCommentDeleted}
				/>
			)}
		</>
	);
}
