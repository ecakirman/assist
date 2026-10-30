import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import {
	GroupCloseButton,
	groupCloseClassName,
} from "./GroupHeader/GroupCloseButton";
import { GroupStatusTally } from "./GroupHeader/GroupStatusTally";
import { GroupToggle } from "./GroupHeader/GroupToggle";
import type { SessionInfo } from "../../../../../../../../types";

const headerSx = {
	display: "flex",
	alignItems: "center",
	gap: 1,
	px: "10px",
	pt: 1.25,
	pb: 0.75,
	bgcolor: "background.paper",
	position: "sticky",
	top: 0,
	zIndex: 1,
	[`&:hover .${groupCloseClassName}`]: { opacity: 1 },
} as const;

const slateHeaderSx = {
	...headerSx,
	gap: 0.75,
	p: "8px 12px 4px",
} as const;

export function GroupHeader({
	label,
	sessions,
	collapsed,
	pinned,
	onToggle,
	onDismiss,
}: {
	label: string;
	sessions: SessionInfo[];
	collapsed: boolean;
	pinned: boolean;
	onToggle: () => void;
	onDismiss: (id: string) => void;
}) {
	const slate = useTheme().design === "slate";
	return (
		<Box sx={slate ? slateHeaderSx : headerSx}>
			<GroupToggle
				label={label}
				count={sessions.length}
				collapsedSummary={<GroupStatusTally sessions={sessions} />}
				collapsed={collapsed}
				pinned={pinned}
				onToggle={onToggle}
			/>
			<GroupCloseButton
				label={label}
				sessionIds={sessions.map((s) => s.id)}
				onDismiss={onDismiss}
			/>
		</Box>
	);
}
