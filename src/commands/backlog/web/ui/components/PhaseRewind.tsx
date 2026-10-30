import type { PhaseStatus, PlanPhase } from "../types";
import { RewindAction } from "./RewindAction";

export type PhaseHeaderProps = {
	phase: PlanPhase;
	index: number;
	status: PhaseStatus;
	itemId?: number;
	onRewind?: () => Promise<void>;
};

export function PhaseRewind({
	phase,
	index,
	status,
	itemId,
	onRewind,
}: PhaseHeaderProps) {
	if (status !== "done" || itemId === undefined || !onRewind) return null;
	return (
		<RewindAction
			itemId={itemId}
			phaseNumber={index + 1}
			phaseName={phase.name}
			onRewound={onRewind}
		/>
	);
}
