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
			scrim: "rgba(0, 0, 0, 0.5)",
			appBar: { background: surface, text: fg },
			onAppBar: {
				...classicDesign.dark.color.onAppBar,
				secondary: muted,
				level: { ok: green, warn: amber, over: red },
			},
			statusBar: {
				background: surface,
				text: muted,
				hoverText: fg,
				secondary: "#5c6473",
				hover: raised,
				active: "transparent",
				dot: accent,
				dotRing: "rgba(139, 156, 255, 0.14)",
				readyText: accent,
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
		color: {
			...classicDesign.light.color,
			scrim: "rgba(15, 23, 42, 0.32)",
			statusBar: {
				background: "#f3f4f6",
				text: "rgba(0, 0, 0, 0.6)",
				hoverText: "rgba(0, 0, 0, 0.87)",
				secondary: "rgba(0, 0, 0, 0.38)",
				hover: "rgba(0, 0, 0, 0.06)",
				active: "transparent",
				dot: "#1976d2",
				dotRing: "rgba(25, 118, 210, 0.16)",
				readyText: "#1976d2",
				level: { ok: "#2e7d32", warn: "#ed6c02", over: "#d32f2f" },
			},
		},
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
		fontSize: 14,
		terminalFontSize: 13,
		scale: {
			caption: 12,
			body2: 14,
			body1: 15,
			subtitle2: 14,
			subtitle1: 15,
			h6: 16,
			h5: 18,
			h4: 24,
			button: 14,
		},
		button: { textTransform: "none", fontWeight: 600 },
	},
	radius: { sm: 6, md: 8 },
	spacing: 8,
};
