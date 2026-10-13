import { Box, Typography } from "@mui/material";
import type { HighLevelStructure } from "../../../../../../../../../review/highLevel/types";
import { DiffViewTypeToggle } from "../../../../../DiffViewTypeToggle";
import type { HighLevelDiffComments } from "../HighLevelDiffComments";
import { HighLevelTreeRows } from "./HighLevelStructureView/HighLevelTreeRows";
import { useDiffViewType } from "../../../../../useDiffViewType";
import { useHighLevelStructureCollapse } from "./HighLevelStructureView/useHighLevelStructureCollapse";

export function HighLevelStructureView({
	structure,
	collapsedPaths,
	subject,
	comments,
}: {
	structure: HighLevelStructure;
	collapsedPaths: string[];
	subject: string;
	comments?: HighLevelDiffComments | undefined;
}) {
	const { dirs, files, fileGlobs } = useHighLevelStructureCollapse(
		subject,
		structure.tree,
		collapsedPaths,
	);
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
					fileGlobs={fileGlobs}
					viewType={viewType}
					comments={comments}
				/>
			</Box>
		</Box>
	);
}
