import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Box } from "@mui/material";

export function HighLevelTreeIgnoredChip({
	label,
	globs,
}: {
	label: string;
	globs: string[];
}) {
	return (
		<Box
			component="span"
			title="Collapsed by review.highLevel.collapsedPaths"
			sx={{
				display: "inline-flex",
				alignItems: "center",
				gap: 0.5,
				fontSize: 11,
				fontWeight: 500,
				lineHeight: "18px",
				color: "text.primary",
				bgcolor: "action.selected",
				borderRadius: 2.5,
				pl: 0.625,
				pr: 0.875,
				flexShrink: 0,
				whiteSpace: "nowrap",
			}}
		>
			<VisibilityOffIcon sx={{ fontSize: 12 }} />
			{label}
			<Box
				component="span"
				sx={{ fontFamily: "monospace", color: "text.secondary" }}
			>
				{globs.join(", ")}
			</Box>
		</Box>
	);
}
