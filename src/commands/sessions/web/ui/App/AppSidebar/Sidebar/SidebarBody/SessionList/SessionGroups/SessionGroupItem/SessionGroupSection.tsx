import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { GroupHeader } from "./SessionGroupSection/GroupHeader";
import { InRepoGroupContext } from "../../../../../useInRepoGroupContext";
import type { SessionInfo } from "../../../../../../../types";
import { useCollapsedGroups } from "../../../../../useCollapsedGroups";

const containerSx = { mb: 0.5 } as const;

const bodySx = { ml: "17px", borderLeft: 1, borderColor: "divider" } as const;

export function SessionGroupSection({
	groupKey,
	label,
	sessions,
	parked,
	onDismiss,
	children,
}: {
	groupKey: string;
	label: string;
	sessions: SessionInfo[];
	parked: boolean;
	onDismiss: (id: string) => void;
	children: ReactNode;
}) {
	const { isCollapsed, setCollapsed } = useCollapsedGroups();
	const pinned = isCollapsed(groupKey);
	const collapsed = pinned || parked;
	return (
		<Box sx={containerSx}>
			<GroupHeader
				label={label}
				sessions={sessions}
				collapsed={collapsed}
				pinned={pinned}
				onToggle={() => setCollapsed(groupKey, !collapsed)}
				onDismiss={onDismiss}
			/>
			{!collapsed && (
				<Box sx={bodySx}>
					<InRepoGroupContext.Provider value>
						{children}
					</InRepoGroupContext.Provider>
				</Box>
			)}
		</Box>
	);
}
