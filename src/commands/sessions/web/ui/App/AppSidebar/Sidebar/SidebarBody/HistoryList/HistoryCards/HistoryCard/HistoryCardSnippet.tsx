import Typography from "@mui/material/Typography";
import type { HistorySnippet } from "../../../../../../../../../shared/HistorySnippet";
import { SearchMark } from "../../../../../../SearchMark";

export function HistoryCardSnippet({ snippet }: { snippet: HistorySnippet }) {
	return (
		<Typography
			variant="caption"
			sx={{ color: "text.secondary", overflowWrap: "anywhere" }}
		>
			{snippet.before}
			<SearchMark>{snippet.match}</SearchMark>
			{snippet.after}
		</Typography>
	);
}
