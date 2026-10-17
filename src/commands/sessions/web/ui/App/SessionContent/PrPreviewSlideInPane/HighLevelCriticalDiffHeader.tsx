import { Box, Link, Typography } from "@mui/material";
import type { HighLevelCriticalDiff } from "../../../../../../review/highLevel/types";
import { HighLevelDiffChevron } from "./HighLevelCriticalDiffHeader/HighLevelDiffChevron";
import { HighLevelLineCounts } from "./HighLevelLineCounts";
import {
	HIGH_LEVEL_STATUS_COLOURS,
	highLevelTreeNameSx,
} from "./highLevelTreeRowSx";

export function HighLevelCriticalDiffHeader({
	diff,
	collapsed,
	onToggle,
}: {
	diff: Pick<
		HighLevelCriticalDiff,
		"path" | "status" | "additions" | "deletions" | "diffUrl"
	>;
	collapsed: boolean;
	onToggle: () => void;
}) {
	return (
		<Box
			onClick={onToggle}
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1,
				minWidth: 0,
				cursor: "pointer",
				borderRadius: 0.5,
				"&:hover": { bgcolor: "action.hover" },
			}}
		>
			<HighLevelDiffChevron
				path={diff.path}
				collapsed={collapsed}
				onToggle={onToggle}
			/>
			<Link
				href={diff.diffUrl}
				target="_blank"
				rel="noreferrer"
				onClick={(event) => event.stopPropagation()}
				sx={{ ...highLevelTreeNameSx, fontWeight: 600 }}
				title={diff.path}
			>
				{diff.path}
			</Link>
			<Typography
				variant="caption"
				sx={{ flexShrink: 0, color: HIGH_LEVEL_STATUS_COLOURS[diff.status] }}
			>
				{diff.status}
			</Typography>
			<HighLevelLineCounts
				additions={diff.additions}
				deletions={diff.deletions}
			/>
		</Box>
	);
}
