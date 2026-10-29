import { keyframes } from "@emotion/react";
import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import { swatches } from "../../../../../designSystem/swatches";

const registerAnimatableHue =
	'@property --rainbow-pill-h { syntax: "<number>"; inherits: true; initial-value: 0; }';

const hue = keyframes`
	from { --rainbow-pill-h: 0; }
	to { --rainbow-pill-h: 360; }
`;

const pulse = keyframes`
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.08); }
`;

const rainbow = {
	content: '""',
	position: "absolute",
	borderRadius: "inherit",
	background:
		"conic-gradient(from calc(var(--rainbow-pill-h) * 1deg) in oklch longer hue, oklch(66% 0.21 0), oklch(66% 0.21 0))",
	animation: `${hue} 1.8s linear infinite`,
} as const;

const pillSx = {
	display: "inline-flex",
	alignItems: "center",
	px: 1.5,
	py: "3px",
	borderRadius: 999,
	position: "relative",
	isolation: "isolate",
	fontWeight: 700,
	animation: `${pulse} 1.6s ease-in-out infinite`,
	"&::before": { ...rainbow, inset: 0, zIndex: -1 },
	"&::after": {
		...rainbow,
		inset: "-5px",
		zIndex: -2,
		filter: "blur(9px)",
		opacity: 0.85,
	},
	"& span": {
		color: swatches.rainbowPill.text,
		textShadow: swatches.rainbowPill.shadow,
	},
	"@media (prefers-reduced-motion: reduce)": {
		animation: "none",
		"&::before, &::after": { animation: "none" },
	},
} as const;

export function RainbowPill({ children }: { children: React.ReactNode }) {
	return (
		<>
			<GlobalStyles styles={registerAnimatableHue} />
			<Box component="span" data-testid="rainbow-pill" sx={pillSx}>
				{children}
			</Box>
		</>
	);
}
