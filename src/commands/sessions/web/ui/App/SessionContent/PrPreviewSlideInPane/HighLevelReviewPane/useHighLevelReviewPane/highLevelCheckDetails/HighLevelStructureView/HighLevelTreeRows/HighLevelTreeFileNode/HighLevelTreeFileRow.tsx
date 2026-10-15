import { Box } from "@mui/material";
import type { HighLevelTreeFile } from "../../../../../../../../../../../../review/highLevel/types";
import { HighLevelLineCounts } from "../../../HighLevelLineCounts";
import {
	highLevelTreeFileButtonSx,
	highLevelTreeFileRowSx,
} from "./HighLevelTreeFileRow/highLevelTreeFileRowSx";
import { HighLevelTreeFileLink } from "./HighLevelTreeFileRow/HighLevelTreeFileLink";
import { HighLevelTreeFileChevron } from "./HighLevelTreeFileRow/HighLevelTreeFileChevron";
import { HighLevelTreeFileLabel } from "./HighLevelTreeFileRow/HighLevelTreeFileLabel";
import { HighLevelTreeIgnoredChip } from "../HighLevelTreeIgnoredChip";

export function HighLevelTreeFileRow({
	file,
	indent,
	open,
	onToggle,
	glob,
	matched,
}: {
	file: HighLevelTreeFile;
	indent: string;
	open: boolean;
	onToggle: () => void;
	glob: string | undefined;
	matched: boolean;
}) {
	const closedByGlob = !open && glob !== undefined;
	return (
		<Box
			onClick={onToggle}
			data-matched={matched || undefined}
			sx={highLevelTreeFileRowSx(open, matched)}
		>
			<Box
				component="button"
				type="button"
				aria-expanded={open}
				aria-label={`${open ? "Collapse" : "Expand"} ${file.path}`}
				sx={highLevelTreeFileButtonSx(indent)}
			>
				<HighLevelTreeFileChevron open={open} />
				<HighLevelTreeFileLabel file={file} muted={closedByGlob} />
				{closedByGlob && (
					<HighLevelTreeIgnoredChip label="ignored" globs={[glob]} />
				)}
				<HighLevelLineCounts
					additions={file.additions}
					deletions={file.deletions}
					inline
				/>
			</Box>
			<HighLevelTreeFileLink file={file} />
		</Box>
	);
}
