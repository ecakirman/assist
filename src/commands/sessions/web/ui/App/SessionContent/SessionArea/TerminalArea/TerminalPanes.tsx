import Box from "@mui/material/Box";
import type { ResizeFn } from "../../../../ResizeFn";
import { hasEnded } from "./TerminalPanes/hasEnded";
import { NoSessionsHint } from "./TerminalPanes/NoSessionsHint";
import { SessionLoadingOverlay } from "./TerminalPanes/SessionLoadingOverlay";
import { TerminalPane } from "./TerminalPanes/TerminalPane";
import type { SessionInfo } from "../../../../types";
import { ownershipOf } from "./TerminalPanes/ownershipOf";
import {
	terminalFrameSx,
	terminalWellSx,
} from "./TerminalPanes/terminalFrameSx";

type OutputSubscriber = (
	sessionId: string,
	handler: (data: string) => void,
) => () => void;

export function TerminalPanes({
	sessions,
	activeId,
	loadingLabel,
	onOutput,
	sendInput,
	sendResize,
}: {
	sessions: SessionInfo[];
	activeId: string | null;
	loadingLabel: string | undefined;
	onOutput: OutputSubscriber;
	sendInput: (sessionId: string, data: string) => void;
	sendResize: ResizeFn;
}) {
	return (
		<Box sx={terminalWellSx}>
			<Box sx={terminalFrameSx}>
				{sessions.map((s) => (
					<TerminalPane
						key={s.id}
						sessionId={s.id}
						visible={s.id === activeId}
						ownership={ownershipOf(s.activeViewer)}
						ended={hasEnded(s.status)}
						hasLastMessage={!!s.lastUserMessage?.trim()}
						activeNode={s.activeViewerNode}
						onOutput={onOutput}
						sendInput={sendInput}
						sendResize={sendResize}
					/>
				))}
				{loadingLabel && <SessionLoadingOverlay label={loadingLabel} />}
				{sessions.length === 0 && <NoSessionsHint />}
			</Box>
		</Box>
	);
}
