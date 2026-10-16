import Typography from "@mui/material/Typography";
import type { HistoricalSession } from "../../../../../../../types";
import { historyTitle } from "./HistoryCardHeading/historyTitle";

export function HistoryCardHeading({
	session,
}: {
	session: HistoricalSession;
}) {
	return (
		<>
			{session.title && (
				<Typography
					variant="body2"
					sx={{
						color: "text.primary",
						fontWeight: 500,
						overflowWrap: "anywhere",
					}}
				>
					{session.title}
				</Typography>
			)}
			<Typography
				variant={session.title ? "caption" : "body2"}
				sx={{
					color: session.title ? "text.secondary" : "text.primary",
					overflowWrap: "anywhere",
				}}
			>
				{historyTitle(session)}
			</Typography>
		</>
	);
}
