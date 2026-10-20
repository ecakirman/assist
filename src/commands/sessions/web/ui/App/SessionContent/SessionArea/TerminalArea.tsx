import { isSessionStarting } from "../../isSessionStarting";
import type { ResizeFn } from "../../../ResizeFn";
import { TerminalPanes } from "./TerminalArea/TerminalPanes";
import type { SessionInfo } from "../../../types";

type OutputSubscriber = (
	sessionId: string,
	handler: (data: string) => void,
) => () => void;

export type TerminalAreaProps = {
	sessions: SessionInfo[];
	activeId: string | null;
	initialized: Set<string>;
	onOutput: OutputSubscriber;
	sendInput: (sessionId: string, data: string) => void;
	sendResize: ResizeFn;
};

export function TerminalArea({
	sessions,
	activeId,
	initialized,
	onOutput,
	sendInput,
	sendResize,
}: TerminalAreaProps) {
	// why: a new session's terminal is empty until its process emits output, so the previously active pane would otherwise show through
	const activeSession = sessions.find((s) => s.id === activeId);
	const loadingLabel =
		activeSession && isSessionStarting(activeSession, initialized)
			? (activeSession.seeding ?? "Starting session…")
			: undefined;

	return (
		<TerminalPanes
			sessions={sessions}
			activeId={activeId}
			loadingLabel={loadingLabel}
			onOutput={onOutput}
			sendInput={sendInput}
			sendResize={sendResize}
		/>
	);
}
