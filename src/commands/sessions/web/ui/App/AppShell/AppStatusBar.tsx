import { StatusBar } from "../../designSystem/StatusBar";
import type { SessionSocket } from "../../useSessionSocket";
import { RateLimitsIndicator } from "./AppToolbar/RateLimitsIndicator";
import { VersionBadge } from "./HamburgerMenu/MenuTriggerButton/VersionBadge";

export function AppStatusBar({ socket }: { socket: SessionSocket }) {
	return (
		<StatusBar
			start={<VersionBadge onStatusBar />}
			end={
				<RateLimitsIndicator
					rateLimits={socket.rateLimits}
					harnessRateLimits={socket.harnessRateLimits}
					onStatusBar
				/>
			}
		/>
	);
}
