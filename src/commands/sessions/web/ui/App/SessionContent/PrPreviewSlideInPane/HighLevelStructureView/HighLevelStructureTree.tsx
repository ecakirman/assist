import { Box, Typography } from "@mui/material";
import { HighLevelTreeRows } from "./HighLevelTreeRows";
import type { HighLevelTreeRowsProps } from "./HighLevelTreeRowsProps";
import { useHighLevelStructureFilter } from "./HighLevelStructureTree/useHighLevelStructureFilter";

export function HighLevelStructureTree({
	glob,
	...props
}: HighLevelTreeRowsProps & { glob: string }) {
	const filter = useHighLevelStructureFilter(
		props.nodes,
		glob,
		props.matches,
		props.collapsed,
	);
	return (
		<Box sx={{ mt: 0.5 }}>
			{filter.noMatches && (
				<Typography variant="caption" sx={{ color: "text.secondary" }}>
					No files match.
				</Typography>
			)}
			<HighLevelTreeRows
				{...props}
				nodes={filter.nodes}
				collapsed={filter.collapsedDirs}
			/>
		</Box>
	);
}
