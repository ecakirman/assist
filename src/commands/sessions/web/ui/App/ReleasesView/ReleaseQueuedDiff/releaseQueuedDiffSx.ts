import { releaseToneColors } from "../releaseToneColors";

export const releaseQueuedDiffSx = {
	button: {
		p: 0.25,
		my: -0.5,
		alignSelf: "center",
		color: "text.secondary",
		"&:hover": { color: releaseToneColors.gate },
		"&[aria-expanded='true']": { color: releaseToneColors.gate },
	},
	icon: { fontSize: 16 },
	paper: { width: "min(720px, calc(100vw - 32px))", mt: 0.75 },
} as const;
