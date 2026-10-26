import type { PaletteMode } from "@mui/material";
import type { ResizeFn } from "../../../../../../../ResizeFn";
import { createTerminal, type TerminalHandle } from "./createTerminal";
import { fitTerminal } from "./fitTerminal";
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
	mode: PaletteMode;
};

export type SessionTerminal = TerminalHandle & { replayOutput: () => void };

export function setupTerminal(
	el: HTMLElement,
	sessionId: string,
	{ sendInput, onOutput, sendResize, isStale, mayResize, mode }: TerminalIo,
): { handle: SessionTerminal; cleanup: () => void } {
	const terminal = createTerminal(el, mode);
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
		const mode = fitTerminal(handle);
		sendResize(sessionId, handle.term.cols, handle.term.rows, mode);
	});

	const cleanup = () => {
		stopObserving();
		unsubOutput();
		handle.dispose();
	};

	return { handle, cleanup };
}
