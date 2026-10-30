import type { SxProps, Theme } from "@mui/material/styles";

export const terminalWellSx: SxProps<Theme> = (t) => ({
	flex: 1,
	display: "flex",
	position: "relative",
	bgcolor: "background.default",
	...(t.design === "slate" && { p: 1.25 }),
});

export const terminalFrameSx: SxProps<Theme> = (t) => ({
	flex: 1,
	position: "relative",
	...(t.design === "slate" && {
		bgcolor: t.tokens.terminal.background,
		border: 1,
		borderColor: t.tokens.color.lineSoft,
		borderRadius: `${t.tokens.radius.md}px`,
		overflow: "hidden",
	}),
});

export function terminalInset(t: Theme, hasLastMessage: boolean) {
	if (t.design !== "slate") return "0 0 0 8px";
	return `${hasLastMessage ? 34 : 6}px 6px 6px 12px`;
}
