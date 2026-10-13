import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { Button } from "@mui/material";
import type { HighLevelStructureBulk } from "../highLevelStructureBulk";
import { highLevelToolbarButtonSx } from "./highLevelToolbarButtonSx";

export function HighLevelBulkButtons({
	bulk,
}: {
	bulk: HighLevelStructureBulk;
}) {
	return (
		<>
			<Button
				size="small"
				color="inherit"
				startIcon={<UnfoldMoreIcon />}
				title="Expand every folder and diff"
				onClick={bulk.expandAll}
				sx={highLevelToolbarButtonSx}
			>
				Expand all
			</Button>
			<Button
				size="small"
				color="inherit"
				startIcon={<UnfoldLessIcon />}
				title="Collapse every diff"
				onClick={bulk.collapseAll}
				sx={highLevelToolbarButtonSx}
			>
				Collapse all
			</Button>
		</>
	);
}
