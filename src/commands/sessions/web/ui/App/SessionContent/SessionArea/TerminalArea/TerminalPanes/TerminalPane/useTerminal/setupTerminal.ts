import type { ResizeFn } from "../../../ResizeFn";
import { createTerminal, type TerminalHandle } from "./createTerminal";
import { handleClipboardKey } from "./setupTerminal/handleClipboardKey";
import { hasTerminalSize } from "./hasTerminalSize";
import { isAppHotkey } from "./setupTerminal/isAppHotkey";
import { observeSettledResize } from "./setupTerminal/observeSettledResize";

type TerminalIo = {
	sendInput: (sessionId: string, data: string) => void;
	onOutput: (sessionId: string, handler: (data: string) => void) => () => void;
	sendResize: ResizeFn;
	isStale: () => boolean;
	mayResize: () => boolean;
};

export type SessionTerminal = TerminalHandle & { replayOutput: () => void };

export function setupTerminal(
	el: HTMLElement,
	sessionId: string,
	{ sendInput, onOutput, sendResize, isStale, mayResize }: TerminalIo,
): { handle: SessionTerminal; cleanup: () => void } {
	const terminal = createTerminal(el);
	const subscribe = () =>
		onOutput(sessionId, (data) => {
			if (!isStale()) terminal.term.write(data);
		});
	let unsubOutput = subscribe();
	const handle: SessionTerminal = {
		...terminal,
		replayOutput: () => {
			unsubOutput();
			unsubOutput = subscribe();
		},
	};

	handle.term.onData((data) => sendInput(sessionId, data));
	handle.term.attachCustomKeyEventHandler((event) => {
		if (isAppHotkey(event)) return false;
		return handleClipboardKey(event, handle.term, navigator.clipboard, (text) =>
			handle.term.paste(text),
		);
	});
	const stopObserving = observeSettledResize(el, () => {
		if (!mayResize() || !hasTerminalSize(el)) return;
		handle.fitAddon.fit();
		sendResize(sessionId, handle.term.cols, handle.term.rows);
	});

	const cleanup = () => {
		stopObserving();
		unsubOutput();
		handle.dispose();
	};

	return { handle, cleanup };
}
