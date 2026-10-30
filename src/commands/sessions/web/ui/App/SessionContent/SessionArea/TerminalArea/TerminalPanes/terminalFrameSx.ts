import type { SxProps, Theme } from "@mui/material/styles";

export const terminalWellSx: SxProps<Theme> = {
	flex: 1,
	display: "flex",
	position: "relative",
	bgcolor: "background.default",
	p: 1.25,
};

export const terminalFrameSx: SxProps<Theme> = (t) => ({
	flex: 1,
	position: "relative",
	bgcolor: t.tokens.terminal.background,
	border: 1,
	borderColor: t.tokens.color.lineSoft,
	borderRadius: `${t.tokens.radius.md}px`,
	overflow: "hidden",
});

export function terminalInset(hasLastMessage: boolean) {
	return `${hasLastMessage ? 34 : 6}px 6px 6px 12px`;
}
