import { Typography } from "@mui/material";

export function HighLevelTreeGlobTag({ glob }: { glob: string }) {
	return (
		<Typography
			component="span"
			title="Collapsed by review.highLevel.collapsedPaths"
			sx={{
				fontFamily: "monospace",
				fontSize: 10,
				color: "text.disabled",
				border: 1,
				borderStyle: "dashed",
				borderColor: "divider",
				borderRadius: 2.5,
				px: 0.75,
				flexShrink: 0,
				whiteSpace: "nowrap",
			}}
		>
			{glob}
		</Typography>
	);
}
