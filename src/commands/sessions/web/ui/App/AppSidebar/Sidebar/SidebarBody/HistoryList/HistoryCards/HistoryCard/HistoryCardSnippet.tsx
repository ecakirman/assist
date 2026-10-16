import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { HistorySnippet } from "../../../../../../../../../shared/HistorySnippet";

export function HistoryCardSnippet({ snippet }: { snippet: HistorySnippet }) {
	return (
		<Typography
			variant="caption"
			sx={{ color: "text.secondary", overflowWrap: "anywhere" }}
		>
			{snippet.before}
			<Box
				component="mark"
				sx={{
					bgcolor: "warning.main",
					color: "warning.contrastText",
					borderRadius: 0.5,
					px: 0.25,
				}}
			>
				{snippet.match}
			</Box>
			{snippet.after}
		</Typography>
	);
}
