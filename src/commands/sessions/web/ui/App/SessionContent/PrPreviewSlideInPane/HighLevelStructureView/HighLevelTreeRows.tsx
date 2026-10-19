import { Box } from "@mui/material";
import { HighLevelTreeDirRow } from "./HighLevelTreeRows/HighLevelTreeDirRow";
import { HighLevelTreeFileNode } from "./HighLevelTreeRows/HighLevelTreeFileNode";
import { HIGH_LEVEL_TREE_INDENT } from "../highLevelTreeRowSx";
import { highLevelDirRowState } from "./HighLevelTreeRows/highLevelDirRowState";
import type { HighLevelTreeRowsProps } from "./HighLevelTreeRowsProps";

export function HighLevelTreeRows(props: HighLevelTreeRowsProps) {
	const { nodes, depth = 0, collapsed, onToggleDir } = props;
	const indent = `${depth * HIGH_LEVEL_TREE_INDENT}px`;

	return nodes.map((node) =>
		node.kind === "file" ? (
			<HighLevelTreeFileNode
				key={node.path}
				file={node}
				indent={indent}
				open={!props.collapsedFiles.has(node.path)}
				onToggle={() => props.onToggleFile(node.path)}
				glob={props.fileGlobs.get(node.path)}
				matched={props.matches.has(node.path)}
				viewType={props.viewType}
				comments={props.comments}
			/>
		) : (
			<Box key={node.path} sx={{ minWidth: 0 }}>
				<HighLevelTreeDirRow
					dir={node}
					{...highLevelDirRowState(node, props)}
					indent={indent}
					onToggle={() => onToggleDir(node.path)}
				/>
				{!collapsed.has(node.path) && (
					<HighLevelTreeRows
						{...props}
						nodes={node.children}
						depth={depth + 1}
					/>
				)}
			</Box>
		),
	);
}
