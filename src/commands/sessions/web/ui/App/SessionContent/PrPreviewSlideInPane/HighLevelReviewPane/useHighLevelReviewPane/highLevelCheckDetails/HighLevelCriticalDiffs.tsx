import { Box } from "@mui/material";
import type { HighLevelCriticalDiff } from "../../../../../../../../../review/highLevel/types";
import type { HighLevelDiffComments } from "../../../HighLevelDiffComments";
import { HighLevelDiffNote } from "../../../HighLevelDiffNote";
import { HighLevelCriticalDiffItem } from "./HighLevelCriticalDiffs/HighLevelCriticalDiffItem";
import { useDiffViewType } from "../../../../../useDiffViewType";
import { useHighLevelCriticalCollapse } from "./HighLevelCriticalDiffs/useHighLevelCriticalCollapse";
import { HighLevelCriticalToolbar } from "./HighLevelCriticalDiffs/HighLevelCriticalToolbar";

export function HighLevelCriticalDiffs({
	diffs,
	criticalPaths,
	subject,
	comments,
}: {
	diffs: HighLevelCriticalDiff[];
	criticalPaths: string[];
	subject: string;
	comments?: HighLevelDiffComments | undefined;
}) {
	const { viewType, onChange } = useDiffViewType();
	const { collapsed, onToggle, bulk } = useHighLevelCriticalCollapse(
		subject,
		diffs,
	);

	if (criticalPaths.length === 0)
		return (
			<HighLevelDiffNote>
				review.highLevel.criticalPaths is unset, so no diffs are shown here.
			</HighLevelDiffNote>
		);
	if (diffs.length === 0)
		return (
			<HighLevelDiffNote>{`No changed file matches ${criticalPaths.join(", ")}.`}</HighLevelDiffNote>
		);
	return (
		<Box sx={{ minWidth: 0 }}>
			<HighLevelCriticalToolbar
				bulk={bulk}
				viewType={viewType}
				onChangeViewType={onChange}
			/>
			{diffs.map((diff) => (
				<HighLevelCriticalDiffItem
					key={diff.path}
					diff={diff}
					collapsed={collapsed.has(diff.path)}
					onToggle={() => onToggle(diff.path)}
					viewType={viewType}
					comments={comments}
				/>
			))}
		</Box>
	);
}
