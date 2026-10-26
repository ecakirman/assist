import type { PaletteMode } from "@mui/material";
import { type RefObject, useEffect } from "react";
import type { TerminalHandle } from "../createTerminal";
import { terminalTheme } from "../terminalTheme";

export function useTerminalTheme(
	handleRef: RefObject<TerminalHandle | null>,
	mode: PaletteMode,
) {
	useEffect(() => {
		const handle = handleRef.current;
		if (handle) handle.term.options.theme = terminalTheme(mode);
	}, [handleRef, mode]);
}
