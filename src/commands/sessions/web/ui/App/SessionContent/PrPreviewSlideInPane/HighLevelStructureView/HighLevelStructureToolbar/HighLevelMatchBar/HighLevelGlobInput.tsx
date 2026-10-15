import { Box, InputBase, Typography } from "@mui/material";
import {
	highLevelGlobInputSx,
	highLevelGlobLabelSx,
} from "./HighLevelGlobInput/highLevelGlobInputSx";

export function HighLevelGlobInput({
	glob,
	onChangeGlob,
	count,
	onSubmit,
}: {
	glob: string;
	onChangeGlob: (glob: string) => void;
	count: number;
	onSubmit: (() => void) | undefined;
}) {
	return (
		<Box component="label" sx={highLevelGlobInputSx}>
			<Typography component="span" sx={highLevelGlobLabelSx}>
				Match
			</Typography>
			<InputBase
				value={glob}
				placeholder="**/*.md"
				onChange={(event) => onChangeGlob(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === "Enter") onSubmit?.();
				}}
				inputProps={{
					"aria-label": "Match changed files",
					spellCheck: false,
					autoComplete: "off",
				}}
				sx={{ flex: 1, minWidth: 0, fontFamily: "monospace", fontSize: 12 }}
			/>
			{glob.trim() && (
				<Typography
					component="span"
					sx={{ ...highLevelGlobLabelSx, color: "text.secondary" }}
				>
					{count} file{count === 1 ? "" : "s"}
				</Typography>
			)}
		</Box>
	);
}
