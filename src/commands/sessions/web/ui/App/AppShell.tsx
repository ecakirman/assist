import AppBar from "@mui/material/AppBar";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { AppRoutes } from "./AppShell/AppRoutes";
import { AppStatusBar } from "./AppShell/AppStatusBar";
import { AppOverlays } from "./AppShell/AppOverlays";
import { AppShellProviders } from "./AppShell/AppShellProviders";
import { AppToolbar } from "./AppShell/AppToolbar";
import { HamburgerMenu } from "./AppShell/HamburgerMenu";
import { ServerRunLayer } from "./AppShell/ServerRunLayer";
import { useAppShell } from "./AppShell/useAppShell";
import { DaemonVersionContext } from "./AppShell/useDaemonVersionContext";

const appBarSx = {
	zIndex: (t: { zIndex: { drawer: number } }) => t.zIndex.drawer + 1,
} as const;
const toolbarSx = { minHeight: 48 } as const;

export function AppShell({
	mode,
	toggle,
	toggleDesign,
}: {
	mode: "light" | "dark";
	toggle: () => void;
	toggleDesign: () => void;
}) {
	const shell = useAppShell();
	const { socket, selection, viewLaunchedSession } = shell;
	const { design } = useTheme();

	return (
		<AppShellProviders shell={shell}>
			<DaemonVersionContext.Provider value={socket.daemonVersion}>
				<HamburgerMenu
					mode={mode}
					toggle={toggle}
					toggleDesign={toggleDesign}
					sessions={socket.sessions}
					reconnecting={socket.reconnecting}
				/>
				<AppBar position="fixed" sx={appBarSx} data-testid="toolbar">
					<AppToolbar socket={socket} selection={selection} />
				</AppBar>
				<Toolbar variant="dense" sx={toolbarSx} />
				<ServerRunLayer socket={socket}>
					<AppRoutes socket={socket} />
				</ServerRunLayer>
				{design === "slate" && <AppStatusBar socket={socket} />}
				<AppOverlays
					socket={socket}
					onViewLaunchedSession={viewLaunchedSession}
				/>
			</DaemonVersionContext.Provider>
		</AppShellProviders>
	);
}
