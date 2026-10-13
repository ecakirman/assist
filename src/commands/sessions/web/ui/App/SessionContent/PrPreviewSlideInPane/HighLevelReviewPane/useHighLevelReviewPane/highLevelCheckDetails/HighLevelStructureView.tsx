import { Box, Typography } from "@mui/material";
import type { HighLevelStructure } from "../../../../../../../../../review/highLevel/types";
import type { HighLevelDiffComments } from "../HighLevelDiffComments";
import { HighLevelStructureToolbar } from "./HighLevelStructureView/HighLevelStructureToolbar";
import { HighLevelTreeRows } from "./HighLevelStructureView/HighLevelTreeRows";
import { useDiffViewType } from "../../../../../useDiffViewType";
import { useHighLevelStructureCollapse } from "./HighLevelStructureView/useHighLevelStructureCollapse";
import { useHighLevelStructureMatch } from "./HighLevelStructureView/useHighLevelStructureMatch";

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
	const { dirs, files, fileGlobs, filePaths, bulk } =
		useHighLevelStructureCollapse(subject, structure.tree, collapsedPaths);
	const { viewType, onChange } = useDiffViewType();
	const match = useHighLevelStructureMatch(filePaths, collapsedPaths);

	if (structure.tree.length === 0)
		return (
			<Typography variant="caption" sx={{ color: "text.secondary" }}>
				No changed files.
			</Typography>
		);

	return (
		<Box sx={{ minWidth: 0 }}>
			<Typography variant="caption" sx={{ color: "text.secondary" }}>
				{structure.added} added · {structure.removed} deleted ·{" "}
				{structure.modified} modified · +{structure.additions} −
				{structure.deletions}
			</Typography>
			<HighLevelStructureToolbar
				bulk={bulk}
				viewType={viewType}
				onChangeViewType={onChange}
				{...match}
			/>
			<Box sx={{ mt: 0.5 }}>
				<HighLevelTreeRows
					nodes={structure.tree}
					collapsed={dirs.collapsed}
					onToggleDir={dirs.onToggle}
					collapsedFiles={files.collapsed}
					onToggleFile={files.onToggle}
					fileGlobs={fileGlobs}
					matches={match.matches}
					viewType={viewType}
					comments={comments}
				/>
			</Box>
		</Box>
	);
}
