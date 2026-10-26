import type { PaletteMode } from "@mui/material";
import type { ITheme } from "@xterm/xterm";

const xtermDefaultAnsi = {
	black: "#2e3436",
	red: "#cc0000",
	green: "#4e9a06",
	yellow: "#c4a000",
	blue: "#3465a4",
	magenta: "#75507b",
	cyan: "#06989a",
	white: "#d3d7cf",
	brightBlack: "#555753",
	brightRed: "#ef2929",
	brightGreen: "#8ae234",
	brightYellow: "#fce94f",
	brightBlue: "#729fcf",
	brightMagenta: "#ad7fa8",
	brightCyan: "#34e2e2",
	brightWhite: "#eeeeec",
};

const dark: ITheme = {
	background: "#1e1e1e",
	foreground: "#d4d4d4",
	cursor: "#ffffff",
	cursorAccent: "#1e1e1e",
	selectionBackground: "rgba(255, 255, 255, 0.3)",
	...xtermDefaultAnsi,
};

const light: ITheme = {
	background: "#ffffff",
	foreground: "#333333",
	cursor: "#333333",
	cursorAccent: "#ffffff",
	selectionBackground: "#add6ff",
	black: "#000000",
	red: "#cd3131",
	green: "#107c10",
	yellow: "#949800",
	blue: "#0451a5",
	magenta: "#bc05bc",
	cyan: "#0598bc",
	white: "#555555",
	brightBlack: "#666666",
	brightRed: "#cd3131",
	brightGreen: "#14ce14",
	brightYellow: "#b5ba00",
	brightBlue: "#0451a5",
	brightMagenta: "#bc05bc",
	brightCyan: "#0598bc",
	brightWhite: "#a5a5a5",
};

export function terminalTheme(mode: PaletteMode): ITheme {
	return mode === "light" ? light : dark;
}
