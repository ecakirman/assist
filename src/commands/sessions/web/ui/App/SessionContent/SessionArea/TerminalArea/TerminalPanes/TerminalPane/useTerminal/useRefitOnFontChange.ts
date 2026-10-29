import { useEffect, useRef } from "react";
import type { TerminalLook } from "./terminalTheme";

export function useRefitOnFontChange(
	{ fontFamily, fontSize }: TerminalLook,
	visible: boolean,
	fit: () => void,
) {
	const font = `${fontSize}px ${fontFamily}`;
	const fittedFont = useRef(font);
	useEffect(() => {
		if (!visible || fittedFont.current === font) return;
		fittedFont.current = font;
		fit();
	}, [font, visible, fit]);
}
