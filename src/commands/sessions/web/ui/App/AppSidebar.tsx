import { Sidebar } from "./AppSidebar/Sidebar";
import type { SidebarTab } from "../types";
import { useJumpToNextWaiting } from "./AppSidebar/useJumpToNextWaiting";
import { useRegionFocusHotkeys } from "./AppSidebar/useRegionFocusHotkeys";
import type { useSessionSocket } from "../useSessionSocket";
import { useSidebarNavigation } from "./AppSidebar/useSidebarNavigation";
import { useSidebarOrdering } from "./AppSidebar/useSidebarOrdering";

type Props = {
	socket: ReturnType<typeof useSessionSocket>;
	tab: SidebarTab;
	onTabChange: (tab: SidebarTab) => void;
	collapsed: boolean;
};

export function AppSidebar({ socket, tab, onTabChange, collapsed }: Props) {
	const { sessions, isParkedGroup } = useSidebarOrdering(
		socket.sessions,
		socket.activeId,
	);
	const { handleSelect, handleResume, handleView } = useSidebarNavigation(
		socket,
		onTabChange,
	);

	useJumpToNextWaiting({
		sessions,
		activeId: socket.activeId,
		tab,
		onSelect: handleSelect,
		onTabChange,
		isParkedGroup,
	});
	useRegionFocusHotkeys({
		sessions: socket.sessions,
		activeId: socket.activeId,
		tab,
		onTabChange,
	});

	return (
		<Sidebar
			sessions={sessions}
			pendingLaunches={socket.pendingLaunches}
			history={socket.history}
			activeId={socket.activeId}
			viewingId={socket.viewingTranscriptSessionId}
			tab={tab}
			onTabChange={onTabChange}
			onSelect={handleSelect}
			onDismissPending={socket.dismissPendingLaunch}
			onView={handleView}
			onResume={handleResume}
			onRetry={socket.retrySession}
			onRestart={socket.restartSession}
			onDismiss={socket.dismissSession}
			onSetAutoApprove={socket.setAutoApprove}
			onSetAutoAdvance={socket.setAutoAdvance}
			initialized={socket.initialized}
			isParkedGroup={isParkedGroup}
			collapsed={collapsed}
		/>
	);
}
