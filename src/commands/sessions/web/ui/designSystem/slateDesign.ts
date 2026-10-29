import { classicDesign } from "./classicDesign";
import type { DesignTokens } from "./DesignTokens";

const ink = "#0e1116";
const surface = "#141820";
const raised = "#1b202a";
const fg = "#e3e7ee";
const muted = "#8a93a3";
const accent = "#8b9cff";
const green = "#5fd0a0";
const amber = "#f2b45a";
const red = "#f27a7a";

export const slateDesign: DesignTokens = {
	name: "slate",
	dark: {
		color: {
			background: ink,
			surface,
			raised,
			line: "#262c37",
			lineSoft: "#1d222b",
			text: { primary: fg, secondary: muted, disabled: "#5c6473" },
			selected: "rgba(139, 156, 255, 0.14)",
			wash: {
				warning: "rgba(242, 180, 90, 0.09)",
				error: "rgba(242, 122, 122, 0.09)",
			},
			well: ink,
			stripe: raised,
			overlay: { background: raised, text: fg },
			appBar: { background: surface, text: fg },
			onAppBar: {
				...classicDesign.dark.color.onAppBar,
				secondary: muted,
				level: { ok: green, warn: amber, over: red },
			},
			primary: { main: accent, contrastText: ink },
			secondary: { main: "#c99bff", contrastText: ink },
			success: { main: green, contrastText: ink },
			warning: { main: amber, contrastText: ink },
			error: { main: red, contrastText: ink },
			info: { main: "#6cb6ff", contrastText: ink },
		},
		terminal: {
			background: ink,
			foreground: "#d6dbe4",
			cursor: accent,
			cursorAccent: ink,
			selectionBackground: "rgba(139, 156, 255, 0.28)",
			black: "#1b2029",
			red,
			green,
			yellow: amber,
			blue: accent,
			magenta: "#c99bff",
			cyan: "#6cc8d8",
			white: "#c3c9d4",
			brightBlack: "#5c6473",
			brightRed: "#ff9a9a",
			brightGreen: "#82e0b6",
			brightYellow: "#ffc97a",
			brightBlue: "#a9b6ff",
			brightMagenta: "#dcb8ff",
			brightCyan: "#8fdbe8",
			brightWhite: "#eef1f6",
		},
		elevation: {
			appBar: 0,
			overlay: "0 14px 34px rgba(0, 0, 0, 0.45)",
			dialog: "0 30px 60px rgba(0, 0, 0, 0.5)",
		},
	},
	light: {
		...classicDesign.light,
		elevation: {
			appBar: 0,
			overlay: "0 8px 24px rgba(15, 23, 42, 0.12)",
			dialog: "0 24px 48px rgba(15, 23, 42, 0.18)",
		},
	},
	font: {
		ui: '"Geist Variable", "Segoe UI", system-ui, sans-serif',
		mono: '"Geist Mono Variable", ui-monospace, Menlo, Consolas, monospace',
		terminal: '"Geist Mono Variable", ui-monospace, Menlo, Consolas, monospace',
	},
	type: {
		fontSize: 13,
		terminalFontSize: 13,
		scale: {
			caption: 11.5,
			body2: 13,
			body1: 14,
			subtitle2: 13,
			subtitle1: 14,
			h6: 15,
			h5: 17,
			h4: 22,
			button: 13,
		},
		button: { textTransform: "none", fontWeight: 600 },
	},
	radius: { sm: 6, md: 8 },
	spacing: 8,
};
