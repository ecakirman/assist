import { alpha, type SxProps, type Theme } from "@mui/material/styles";

export const nextHeroSx: SxProps<Theme> = (t) => ({
	p: 2.5,
	...(t.design === "slate" && {
		borderColor: alpha(t.palette.primary.main, 0.4),
		borderRadius: `${t.tokens.radius.md + 2}px`,
		backgroundImage: `linear-gradient(180deg, ${t.palette.action.selected}, transparent 70%)`,
	}),
});
