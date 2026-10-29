import { type RefObject, useEffect, useRef } from "react";
import type { ResizeFn } from "../../../../../../../ResizeFn";
import { type SessionTerminal, setupTerminal } from "./setupTerminal";
import type { TerminalLook } from "./terminalTheme";
import { useTerminalTheme } from "./useMountTerminal/useTerminalTheme";

type MountIo = {
	sendInput: (sessionId: string, data: string) => void;
	onOutput: (sessionId: string, handler: (data: string) => void) => () => void;
	sendResize: ResizeFn;
	staleRef: RefObject<boolean>;
	mayResize: () => boolean;
	look: TerminalLook;
};

export function useMountTerminal(
	containerRef: RefObject<HTMLDivElement | null>,
	sessionId: string,
	{ sendInput, onOutput, sendResize, staleRef, mayResize, look }: MountIo,
): RefObject<SessionTerminal | null> {
	const handleRef = useRef<SessionTerminal | null>(null);
	const lookRef = useRef(look);
	lookRef.current = look;

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const { handle, cleanup } = setupTerminal(el, sessionId, {
			sendInput,
			onOutput,
			sendResize,
			isStale: () => staleRef.current,
			mayResize,
			look: lookRef.current,
		});
		handleRef.current = handle;
		return () => {
			cleanup();
			handleRef.current = null;
		};
	}, [
		containerRef,
		sessionId,
		onOutput,
		sendInput,
		sendResize,
		staleRef,
		mayResize,
		lookRef,
	]);

	useTerminalTheme(handleRef, look);
	return handleRef;
}
