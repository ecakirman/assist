import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import type { HighLevelTreeFile } from "../../../../../../../../../../../../review/highLevel/types";
import { HighLevelLineCounts } from "../../../HighLevelLineCounts";
import {
	highLevelButtonResetSx,
	highLevelTintedRowSx,
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
		<Box sx={[{ ...highLevelTreeRowSx, gap: 0 }, open && highLevelTintedRowSx]}>
			<Box
				component="button"
				type="button"
				onClick={onToggle}
				aria-expanded={open}
				aria-label={`${open ? "Collapse" : "Expand"} ${file.path}`}
				sx={{
					...highLevelTreeRowSx,
					"&:hover": undefined,
					flex: 1,
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
				/>
			</Box>
			<HighLevelTreeFileLink file={file} />
		</Box>
	);
}
