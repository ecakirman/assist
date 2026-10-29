import { releaseToneColors } from "../../../../releaseToneColors";

export const releaseQueuedCommitRowSx = {
	row: (live: boolean) =>
		({
			display: "grid",
			gridTemplateColumns: "7ch minmax(0, 1fr) auto",
			alignItems: "baseline",
			columnGap: 1.5,
			px: 1.5,
			py: 0.5,
			opacity: live ? 0.62 : 1,
			"&:hover": { bgcolor: "action.hover" },
		}) as const,
	ref: { fontFamily: "fontFamilyMono", fontSize: 12.5 },
	subject: {
		display: "flex",
		alignItems: "baseline",
		minWidth: 0,
		fontSize: 13,
	},
	subjectText: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	by: { fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" },
	liveBadge: {
		ml: 1,
		px: 0.5,
		flexShrink: 0,
		border: "1px solid currentColor",
		borderRadius: "3px",
		fontSize: 10.5,
		fontWeight: 600,
		letterSpacing: "0.06em",
		textTransform: "uppercase",
		color: releaseToneColors.ok,
	},
} as const;
