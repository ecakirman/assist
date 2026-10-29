import type { PaletteMode, SimplePaletteColorOptions } from "@mui/material";
import type { ITheme } from "@xterm/xterm";

export type DesignName = "classic" | "slate";

type ColorTokens = {
	background: string;
	surface: string;
	raised: string;
	line: string;
	lineSoft: string;
	text: { primary: string; secondary: string; disabled: string };
	selected: string;
	overlay: { background: string; text: string };
	appBar?: { background: string; text: string };
	primary: SimplePaletteColorOptions;
	secondary: SimplePaletteColorOptions;
	success: SimplePaletteColorOptions;
	warning: SimplePaletteColorOptions;
	error: SimplePaletteColorOptions;
	info: SimplePaletteColorOptions;
};

type ElevationTokens = {
	appBar: number;
	overlay?: string;
	dialog?: string;
};

type ModeTokens = {
	color: ColorTokens;
	terminal: ITheme;
	elevation: ElevationTokens;
};

type TypeScale = {
	caption: number;
	body2: number;
	body1: number;
	subtitle2: number;
	subtitle1: number;
	h6: number;
	h5: number;
	h4: number;
	button: number;
};

export type DesignTokens = {
	name: DesignName;
	dark: ModeTokens;
	light: ModeTokens;
	font: { ui: string; mono: string; terminal: string };
	type: {
		fontSize: number;
		terminalFontSize: number;
		scale: TypeScale;
		button: { textTransform: "uppercase" | "none"; fontWeight: number };
	};
	radius: { sm: number; md: number };
	spacing: number;
};

export type ActiveTokens = Omit<DesignTokens, "dark" | "light"> &
	ModeTokens & { mode: PaletteMode };
