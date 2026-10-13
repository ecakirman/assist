import { Box, Typography } from "@mui/material";
import type { HighLevelStructure } from "../../../../../../../../../review/highLevel/types";
import { DiffViewTypeToggle } from "../../../../../DiffViewTypeToggle";
import type { HighLevelDiffComments } from "../HighLevelDiffComments";
import { HighLevelTreeRows } from "./HighLevelStructureView/HighLevelTreeRows";
import { useDiffViewType } from "../../../../../useDiffViewType";
import { useHighLevelCollapse } from "./useHighLevelCollapse";

export function HighLevelStructureView({
	structure,
	subject,
	comments,
}: {
	structure: HighLevelStructure;
	subject: string;
	comments?: HighLevelDiffComments | undefined;
}) {
	const dirs = useHighLevelCollapse(subject);
	const files = useHighLevelCollapse(`files:${subject}`);
	const { viewType, onChange } = useDiffViewType();

	if (structure.tree.length === 0)
		return (
			<Typography variant="caption" sx={{ color: "text.secondary" }}>
				No changed files.
			</Typography>
		);

	return (
		<Box sx={{ minWidth: 0 }}>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Typography variant="caption" sx={{ color: "text.secondary" }}>
					{structure.added} added · {structure.removed} deleted ·{" "}
					{structure.modified} modified · +{structure.additions} −
					{structure.deletions}
				</Typography>
				<Box sx={{ ml: "auto" }}>
					<DiffViewTypeToggle viewType={viewType} onChange={onChange} />
				</Box>
			</Box>
			<Box sx={{ mt: 0.5 }}>
				<HighLevelTreeRows
					nodes={structure.tree}
					collapsed={dirs.collapsed}
					onToggleDir={dirs.onToggle}
					collapsedFiles={files.collapsed}
					onToggleFile={files.onToggle}
					viewType={viewType}
					comments={comments}
				/>
			</Box>
		</Box>
	);
}
