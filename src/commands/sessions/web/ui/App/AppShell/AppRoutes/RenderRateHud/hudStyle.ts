import type { CSSProperties } from "react";
import { statusBarInset } from "../../../../designSystem/statusBarInset";
import { swatches } from "../../../../designSystem/swatches";

export const hudStyle = (monoFont: string): CSSProperties => ({
	position: "fixed",
	bottom: `calc(8px + ${statusBarInset})`,
	right: 8,
	zIndex: 3000,
	background: swatches.renderHud.background,
	color: swatches.renderHud.text,
	font: `11px/1.4 ${monoFont}`,
	padding: "6px 8px",
	borderRadius: 4,
	whiteSpace: "pre",
	cursor: "pointer",
	userSelect: "none",
});
