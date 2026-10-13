import { Box } from "@mui/material";
import type { HighLevelTreeFile } from "../../../../../../../../../../../../review/highLevel/types";
import { HighLevelLineCounts } from "../../../HighLevelLineCounts";
import {
	highLevelButtonResetSx,
	highLevelTintedRowSx,
	highLevelTreeRowButtonSx,
	highLevelTreeRowSx,
} from "../../../highLevelTreeRowSx";
import { HighLevelTreeFileLink } from "./HighLevelTreeFileRow/HighLevelTreeFileLink";
import { HighLevelTreeFileChevron } from "./HighLevelTreeFileRow/HighLevelTreeFileChevron";
import { HighLevelTreeFileLabel } from "./HighLevelTreeFileRow/HighLevelTreeFileLabel";
import { HighLevelTreeGlobTag } from "./HighLevelTreeFileRow/HighLevelTreeGlobTag";

export function HighLevelTreeFileRow({
	file,
	indent,
	open,
	onToggle,
	glob,
}: {
	file: HighLevelTreeFile;
	indent: string;
	open: boolean;
	onToggle: () => void;
	glob: string | undefined;
}) {
	const closedByGlob = !open && glob !== undefined;
	return (
		<Box
			onClick={onToggle}
			sx={[
				{ ...highLevelTreeRowSx, gap: 0, cursor: "pointer" },
				open && highLevelTintedRowSx,
			]}
		>
			<Box
				component="button"
				type="button"
				aria-expanded={open}
				aria-label={`${open ? "Collapse" : "Expand"} ${file.path}`}
				sx={{
					...highLevelTreeRowSx,
					minHeight: highLevelTreeRowButtonSx.minHeight,
					"&:hover": undefined,
					minWidth: 0,
					pl: indent,
					...highLevelButtonResetSx,
				}}
			>
				<HighLevelTreeFileChevron open={open} />
				<HighLevelTreeFileLabel file={file} muted={closedByGlob} />
				{closedByGlob && <HighLevelTreeGlobTag glob={glob} />}
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
