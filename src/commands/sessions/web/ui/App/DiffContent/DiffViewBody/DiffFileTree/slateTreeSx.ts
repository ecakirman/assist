import type { Theme } from "@mui/material/styles";

export function slateTreeSx(active: boolean) {
	return (t: Theme) =>
		t.design === "slate"
			? {
					borderRadius: "4px",
					color: active ? "text.primary" : "text.secondary",
					fontWeight: 400,
					"&:hover": { bgcolor: t.tokens.color.raised, color: "text.primary" },
					...(active && { bgcolor: t.tokens.color.raised }),
					"& .MuiButtonBase-root .MuiTypography-root": {
						fontSize: 11.5,
						color: "inherit",
					},
					"& .MuiButtonBase-root": { py: "3px" },
				}
			: {};
}

export const slateTreeDirSx = (t: Theme) => ({
	...(t.design === "slate" && {
		"&, &:hover": { bgcolor: "transparent" },
		"& .MuiTypography-root": { fontSize: 11.5, color: "text.disabled" },
		"& .MuiSvgIcon-root": { fontSize: 14, color: "text.disabled" },
		"& .MuiButtonBase-root": { py: "3px" },
	}),
});

export const slateTreeGlyphSx = {
	width: 14,
	flexShrink: 0,
	textAlign: "center",
	fontSize: 10,
	color: "text.disabled",
} as const;

export const slateTreePanelSx = (t: Theme) =>
	t.design === "slate"
		? {
				width: 240,
				pt: 1,
				pr: 0.75,
				pl: 0.75,
				mr: 1,
				borderRight: 1,
				borderColor: t.tokens.color.lineSoft,
			}
		: {};
