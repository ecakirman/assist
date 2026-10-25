import Box from "@mui/material/Box";
import type { SessionInfo, SessionListHandlers } from "../../../types";
import { ActiveSessionTopBar } from "./SessionAreaTopBar/ActiveSessionTopBar";

const topBarSx = { flexShrink: 0 } as const;

export function SessionAreaTopBar({
	session,
	sessions,
	lifecycle,
}: {
	session: SessionInfo | undefined;
	sessions: SessionInfo[];
	lifecycle: SessionListHandlers;
}) {
	if (session === undefined) return null;
	return (
		<Box data-testid="session-top-bar" sx={topBarSx}>
			<ActiveSessionTopBar
				session={session}
				sessions={sessions}
				lifecycle={lifecycle}
			/>
		</Box>
	);
}
