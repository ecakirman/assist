import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import { slateDesign } from "./slateDesign";

export function loadFontsBeforeTerminalsOpen(): Promise<unknown> {
	if (typeof document === "undefined" || !document.fonts)
		return Promise.resolve();
	const { font, type } = slateDesign;
	return Promise.allSettled([
		document.fonts.load(`${type.fontSize}px ${font.ui}`),
		document.fonts.load(`${type.terminalFontSize}px ${font.terminal}`),
	]);
}
