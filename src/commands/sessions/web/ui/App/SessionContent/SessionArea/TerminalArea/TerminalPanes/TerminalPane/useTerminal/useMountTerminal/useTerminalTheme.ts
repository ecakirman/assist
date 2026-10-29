import { type RefObject, useEffect } from "react";
import type { TerminalHandle } from "../createTerminal";
import type { TerminalLook } from "../terminalTheme";

export function useTerminalTheme(
	handleRef: RefObject<TerminalHandle | null>,
	look: TerminalLook,
) {
	useEffect(() => {
		const handle = handleRef.current;
		if (handle) Object.assign(handle.term.options, look);
	}, [handleRef, look]);
}
