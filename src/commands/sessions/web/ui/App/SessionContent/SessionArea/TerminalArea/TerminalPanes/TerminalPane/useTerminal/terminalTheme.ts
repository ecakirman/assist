import type { ITheme } from "@xterm/xterm";
import type { ActiveTokens } from "../../../../../../../designSystem/DesignTokens";

export type TerminalLook = {
	theme: ITheme;
	fontFamily: string;
	fontSize: number;
};

export function terminalTheme({
	terminal,
	font,
	type,
}: ActiveTokens): TerminalLook {
	return {
		theme: terminal,
		fontFamily: font.terminal,
		fontSize: type.terminalFontSize,
	};
}
