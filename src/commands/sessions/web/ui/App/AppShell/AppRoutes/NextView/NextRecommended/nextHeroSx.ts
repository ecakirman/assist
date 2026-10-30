import { alpha, type SxProps, type Theme } from "@mui/material/styles";

export const nextHeroSx: SxProps<Theme> = (t) => ({
	px: 2.5,
	py: "18px",
	"& > .MuiStack-root": { gap: "10px" },
	"& > .MuiStack-root > :not(style) ~ :not(style)": { mt: 0 },
	"& h2": {
		fontSize: 19,
		fontWeight: 600,
		lineHeight: 1.35,
		letterSpacing: "-0.01em",
	},
	"& .MuiTypography-overline": {
		fontSize: 11,
		fontWeight: 600,
		letterSpacing: "0.08em",
		color: "text.disabled",
	},
	borderColor: alpha(t.palette.primary.main, 0.4),
	borderRadius: `${t.tokens.radius.md + 2}px`,
	backgroundImage: `linear-gradient(180deg, ${t.palette.action.selected}, transparent 70%)`,
});
