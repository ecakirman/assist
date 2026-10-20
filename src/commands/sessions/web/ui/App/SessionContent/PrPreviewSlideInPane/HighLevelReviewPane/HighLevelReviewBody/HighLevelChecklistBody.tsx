import { Stack } from "@mui/material";
import { type ReactNode, useRef } from "react";
import type { HighLevelCheckResult } from "../../../../../../../../review/highLevel/types";
import { HighLevelCheckGroup } from "./HighLevelChecklistBody/HighLevelCheckGroup";
import { HighLevelJumpStrip } from "./HighLevelChecklistBody/HighLevelJumpStrip";
import { useHighLevelJumpSpy } from "./HighLevelChecklistBody/useHighLevelJumpSpy";
import type { useHighLevelChecklist } from "../useHighLevelChecklist";

export function HighLevelChecklistBody({
	checks,
	checklist,
	details,
	counts,
}: {
	checks: HighLevelCheckResult[];
	checklist: ReturnType<typeof useHighLevelChecklist>;
	details: Record<string, ReactNode>;
	counts: Record<string, string>;
}) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const manual = checks.filter((check) => check.kind === "manual");
	const activeId = useHighLevelJumpSpy(
		scrollRef,
		manual.map((check) => check.id),
	);
	return (
		<Stack
			ref={scrollRef}
			spacing={2}
			sx={{
				flex: 1,
				minHeight: 0,
				overflowY: "auto",
				pt: manual.length > 0 ? 0 : 2,
				pb: 2,
			}}
		>
			<HighLevelJumpStrip
				checks={manual}
				ticked={checklist.ticked}
				counts={counts}
				activeId={activeId}
			/>
			<HighLevelCheckGroup
				heading="Evaluated for you"
				checks={checks.filter((check) => check.kind === "deterministic")}
				checklist={checklist}
				details={details}
			/>
			<HighLevelCheckGroup
				heading="Yours to judge"
				checks={manual}
				checklist={checklist}
				details={details}
			/>
		</Stack>
	);
}
