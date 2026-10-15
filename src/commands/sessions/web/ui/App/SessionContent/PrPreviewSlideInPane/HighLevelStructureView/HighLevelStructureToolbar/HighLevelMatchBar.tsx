import { Button } from "@mui/material";
import { HighLevelGlobInput } from "./HighLevelMatchBar/HighLevelGlobInput";
import { HighLevelQuickChips } from "./HighLevelMatchBar/HighLevelQuickChips";
import { highLevelToolbarButtonSx } from "./highLevelToolbarButtonSx";

export function HighLevelMatchBar({
	glob,
	onChangeGlob,
	matches,
	quickGlobs,
	onShow,
	onHide,
}: {
	glob: string;
	onChangeGlob: (glob: string) => void;
	matches: Set<string>;
	quickGlobs: string[];
	onShow: () => void;
	onHide: () => void;
}) {
	const none = matches.size === 0;
	const buttonSx = { ...highLevelToolbarButtonSx, minWidth: 0 };
	return (
		<>
			<HighLevelGlobInput
				glob={glob}
				onChangeGlob={onChangeGlob}
				count={matches.size}
				onSubmit={none ? undefined : onShow}
			/>
			<Button
				size="small"
				variant="outlined"
				color="inherit"
				disabled={none}
				title="Open the matching diffs and their folders"
				onClick={onShow}
				sx={buttonSx}
			>
				Show
			</Button>
			<Button
				size="small"
				variant="outlined"
				color="inherit"
				disabled={none}
				title="Collapse the matching diffs"
				onClick={onHide}
				sx={buttonSx}
			>
				Hide
			</Button>
			<HighLevelQuickChips
				globs={quickGlobs}
				active={glob}
				onSelect={(quick) => onChangeGlob(quick === glob ? "" : quick)}
			/>
		</>
	);
}
