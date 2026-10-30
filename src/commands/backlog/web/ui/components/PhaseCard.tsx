import { Paper } from "@mui/material";
import type {
	PhaseSession,
	PhaseStatus,
	PhaseUsage,
	PlanPhase,
} from "../types";
import { phaseAnchor } from "./itemSectionAnchor";
import { ManualChecks } from "./ManualChecks";
import { markers, phaseCardSx } from "./phaseCardSx";
import { PhaseSessionsLine } from "./PhaseSessionsLine";
import { PhaseUsageLine } from "./PhaseUsageLine";
import { SlatePhaseHeader } from "./SlatePhaseHeader";
import { TaskList } from "./TaskList";

type PhaseCardProps = {
	phase: PlanPhase;
	index: number;
	status: PhaseStatus;
	itemId?: number;
	usage?: PhaseUsage;
	sessions?: PhaseSession[];
	onRewind?: () => Promise<void>;
};

export function PhaseCard({
	phase,
	index,
	status,
	itemId,
	usage,
	sessions,
	onRewind,
}: PhaseCardProps) {
	const checks = phase.manualChecks ?? [];
	const anchor = phaseAnchor(index);
	const marker = markers[status];
	return (
		<Paper
			variant="outlined"
			id={anchor.id}
			sx={[phaseCardSx(status), anchor.sx]}
		>
			<SlatePhaseHeader
				phase={phase}
				index={index}
				status={status}
				itemId={itemId}
				onRewind={onRewind}
			/>
			{usage && <PhaseUsageLine usage={usage} />}
			<TaskList tasks={phase.tasks} marker={marker} />
			{checks.length > 0 && <ManualChecks checks={checks} />}
			{sessions && sessions.length > 0 && (
				<PhaseSessionsLine sessions={sessions} />
			)}
		</Paper>
	);
}
