import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Button } from "@mui/material";
import { highLevelToolbarButtonSx } from "./highLevelToolbarButtonSx";

export function HighLevelResetButton({
	changes,
	onReset,
}: {
	changes: number;
	onReset: () => void;
}) {
	return (
		<Button
			size="small"
			variant="outlined"
			disabled={changes === 0}
			startIcon={<RestartAltIcon />}
			title="Return to the review.highLevel.collapsedPaths defaults"
			onClick={onReset}
			sx={highLevelToolbarButtonSx}
		>
			{changes === 0
				? "Defaults"
				: `Reset ${changes} change${changes === 1 ? "" : "s"}`}
		</Button>
	);
}
