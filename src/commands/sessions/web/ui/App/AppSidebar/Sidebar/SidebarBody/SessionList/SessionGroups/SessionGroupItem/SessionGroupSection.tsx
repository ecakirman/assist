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
	onDismiss,
	children,
}: {
	groupKey: string;
	label: string;
	sessions: SessionInfo[];
	onDismiss: (id: string) => void;
	children: ReactNode;
}) {
	const { isCollapsed, toggleCollapsed } = useCollapsedGroups();
	const collapsed = isCollapsed(groupKey);
	return (
		<Box sx={containerSx}>
			<GroupHeader
				label={label}
				sessions={sessions}
				collapsed={collapsed}
				onToggle={() => toggleCollapsed(groupKey)}
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
