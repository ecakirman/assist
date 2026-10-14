import type { ResizeMode } from "../../../../../../../ResizeFn";
import type { TerminalHandle } from "./createTerminal";

export function fitTerminal({
	term,
	fitAddon,
}: TerminalHandle): ResizeMode | undefined {
	const { cols, rows } = term;
	fitAddon.fit();
	return term.cols !== cols || term.rows !== rows ? "refresh" : undefined;
}
