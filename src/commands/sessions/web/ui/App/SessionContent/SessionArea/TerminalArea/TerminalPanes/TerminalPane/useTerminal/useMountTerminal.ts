import type { PaletteMode } from "@mui/material";
import { type RefObject, useEffect, useRef } from "react";
import type { ResizeFn } from "../../../../../../../ResizeFn";
import { type SessionTerminal, setupTerminal } from "./setupTerminal";
import { useTerminalTheme } from "./useMountTerminal/useTerminalTheme";

type MountIo = {
	sendInput: (sessionId: string, data: string) => void;
	onOutput: (sessionId: string, handler: (data: string) => void) => () => void;
	sendResize: ResizeFn;
	staleRef: RefObject<boolean>;
	mayResize: () => boolean;
	mode: PaletteMode;
};

export function useMountTerminal(
	containerRef: RefObject<HTMLDivElement | null>,
	sessionId: string,
	{ sendInput, onOutput, sendResize, staleRef, mayResize, mode }: MountIo,
): RefObject<SessionTerminal | null> {
	const handleRef = useRef<SessionTerminal | null>(null);
	const modeRef = useRef(mode);
	modeRef.current = mode;

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const { handle, cleanup } = setupTerminal(el, sessionId, {
			sendInput,
			onOutput,
			sendResize,
			isStale: () => staleRef.current,
			mayResize,
			mode: modeRef.current,
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
		modeRef,
	]);

	useTerminalTheme(handleRef, mode);
	return handleRef;
}
