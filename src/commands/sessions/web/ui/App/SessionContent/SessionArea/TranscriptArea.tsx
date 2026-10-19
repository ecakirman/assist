import Box from "@mui/material/Box";
import { TranscriptPane } from "./TranscriptArea/TranscriptPane";
import type { Transcript } from "../../../types";
import { useTranscriptHighlightTerm } from "../../useHistorySearchQuery";

export function TranscriptArea({
	sessionId,
	transcript,
}: {
	sessionId: string;
	transcript: Transcript | null;
}) {
	const term = useTranscriptHighlightTerm();
	const ready = transcript?.sessionId === sessionId;
	return (
		<Box sx={{ flex: 1, position: "relative", bgcolor: "background.default" }}>
			<TranscriptPane
				messages={ready ? (transcript?.messages ?? []) : []}
				loading={!ready}
				term={term}
			/>
		</Box>
	);
}
