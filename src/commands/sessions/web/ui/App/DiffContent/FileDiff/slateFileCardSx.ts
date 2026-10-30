import type { Theme } from "@mui/material/styles";

export const slateFileCardSx = (t: Theme) => ({
	mb: 1,
	border: 1,
	borderColor: t.tokens.color.lineSoft,
	borderRadius: `${t.tokens.radius.sm}px`,
	bgcolor: "background.default",
	overflow: "clip",
});

export const slateFileHeaderSx = (t: Theme) => ({
	gap: 1,
	px: 1.25,
	py: "6px",
	mb: 0,
	borderColor: t.tokens.color.lineSoft,
	"& .MuiSvgIcon-root": { fontSize: 16, color: "text.disabled" },
	"& .MuiTypography-root": { fontSize: 12, fontWeight: 400 },
});
