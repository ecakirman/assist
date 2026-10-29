import { type RefObject, useRef } from "react";
import type { Ownership } from "../Ownership";
import type { ResizeFn } from "../../../../../../ResizeFn";
import { isUserPresent } from "./useTerminal/isUserPresent";
import { maySizeSession } from "./useTerminal/maySizeSession";
import { pressHandler } from "./useTerminal/pressHandler";
import { useFitWhenVisible } from "./useTerminal/useFitWhenVisible";
import { useMountTerminal } from "./useTerminal/useMountTerminal";
import { useRefitOnFontChange } from "./useTerminal/useRefitOnFontChange";
import { useTakeOver } from "./useTerminal/useTakeOver";
import type { TerminalLook } from "./useTerminal/terminalTheme";

type TerminalOptions = {
	visible: boolean;
	ownership: Ownership;
	ended: boolean;
	look: TerminalLook;
	sendInput: (sessionId: string, data: string) => void;
	onOutput: (sessionId: string, handler: (data: string) => void) => () => void;
	sendResize: ResizeFn;
};

export function useTerminal(
	containerRef: RefObject<HTMLDivElement | null>,
	sessionId: string,
	{
		visible,
		ownership,
		ended,
		look,
		sendInput,
		onOutput,
		sendResize,
	}: TerminalOptions,
): (() => void) | undefined {
	const staleRef = useRef(ownership === "other");
	const stateRef = useRef({ visible, ownership });
	stateRef.current = { visible, ownership };
	const mayResizeRef = useRef(() =>
		maySizeSession(
			stateRef.current.ownership,
			stateRef.current.visible,
			isUserPresent(),
		),
	);

	const handleRef = useMountTerminal(containerRef, sessionId, {
		sendInput,
		onOutput,
		sendResize,
		staleRef,
		mayResize: mayResizeRef.current,
		look,
	});

	const refs = { containerRef, handleRef, staleRef };
	const takeOver = useTakeOver(
		refs,
		sessionId,
		{ ownership, ended },
		sendResize,
	);
	const fit = useFitWhenVisible(
		{ ...refs, mayResize: mayResizeRef.current, takeOver },
		sessionId,
		{ visible, ownership },
		sendResize,
	);
	useRefitOnFontChange(look, visible, fit);
	return pressHandler(ownership, takeOver, fit);
}
