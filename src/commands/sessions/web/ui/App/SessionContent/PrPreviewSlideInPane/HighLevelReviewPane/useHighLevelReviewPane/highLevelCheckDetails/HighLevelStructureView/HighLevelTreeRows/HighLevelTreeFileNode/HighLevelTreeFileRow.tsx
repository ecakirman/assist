import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import type { HighLevelTreeFile } from "../../../../../../../../../../../../review/highLevel/types";
import { HighLevelLineCounts } from "../../../HighLevelLineCounts";
import {
	highLevelButtonResetSx,
	highLevelTintedRowSx,
	highLevelTreeRowButtonSx,
	highLevelTreeRowSx,
} from "../../../highLevelTreeRowSx";
import { HighLevelTreeFileLabel } from "./HighLevelTreeFileRow/HighLevelTreeFileLabel";
import { HighLevelTreeFileLink } from "./HighLevelTreeFileRow/HighLevelTreeFileLink";

export function HighLevelTreeFileRow({
	file,
	indent,
	open,
	onToggle,
}: {
	file: HighLevelTreeFile;
	indent: string;
	open: boolean;
	onToggle: () => void;
}) {
	const Chevron = open ? ExpandMoreIcon : ChevronRightIcon;
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
				<Chevron
					sx={{
						fontSize: 16,
						color: open ? "primary.main" : "text.secondary",
						flexShrink: 0,
					}}
				/>
				<HighLevelTreeFileLabel file={file} />
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
