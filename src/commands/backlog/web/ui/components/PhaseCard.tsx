import { Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type {
	PhaseSession,
	PhaseStatus,
	PhaseUsage,
	PlanPhase,
} from "../types";
import { phaseAnchor } from "./itemSectionAnchor";
import { ManualChecks } from "./ManualChecks";
import { markers, phaseCardSx, slateMarkers } from "./phaseCardSx";
import { PhaseHeader } from "./PhaseHeader";
import { PhaseSessionsLine } from "./PhaseSessionsLine";
import { PhaseUsageLine } from "./PhaseUsageLine";
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
	const marker = (useTheme().design === "slate" ? slateMarkers : markers)[
		status
	];
	return (
		<Paper
			variant="outlined"
			id={anchor.id}
			sx={[phaseCardSx(status), anchor.sx]}
		>
			<PhaseHeader
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
