import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import type { ReleaseCompareCommit } from "../../../../../../releases/types";
import { formatRelativeTime } from "../../../../../formatRelativeTime";
import { releaseToneColors } from "../../../releaseToneColors";

const SHORT_SHA = 7;

const rowSx = (live: boolean) =>
	({
		display: "grid",
		gridTemplateColumns: "7ch 1fr",
		columnGap: 1.5,
		rowGap: "1px",
		px: 1.5,
		py: 0.75,
		opacity: live ? 0.62 : 1,
		"&:hover": { bgcolor: "action.hover" },
	}) as const;

const shaSx = {
	fontFamily: "monospace",
	fontSize: 12.5,
	gridRow: "span 2",
	pt: "1px",
} as const;

const subjectSx = {
	fontSize: 13,
	lineHeight: 1.35,
	minWidth: 0,
	overflowWrap: "anywhere",
} as const;

const bySx = { fontSize: 12, color: "text.secondary" } as const;

const liveBadgeSx = {
	ml: 1,
	px: 0.5,
	border: "1px solid currentColor",
	borderRadius: "3px",
	fontSize: 10.5,
	fontWeight: 600,
	letterSpacing: "0.06em",
	textTransform: "uppercase",
	color: releaseToneColors.ok,
	verticalAlign: "1px",
} as const;

function byline({ author, date }: ReleaseCompareCommit): string {
	return [author, date && formatRelativeTime(date)].filter(Boolean).join(" · ");
}

export function ReleaseQueuedCommitRow({
	repo,
	commit,
	live = false,
}: {
	repo: string;
	commit: ReleaseCompareCommit;
	live?: boolean;
}) {
	return (
		<Box component="li" sx={rowSx(live)}>
			<Link
				sx={shaSx}
				href={`https://github.com/${repo}/commit/${commit.sha}`}
				target="_blank"
				rel="noreferrer"
			>
				{commit.sha.slice(0, SHORT_SHA)}
			</Link>
			<Box component="span" sx={subjectSx}>
				{commit.subject}
				{live && (
					<Box component="span" sx={liveBadgeSx}>
						live
					</Box>
				)}
			</Box>
			<Box component="span" sx={bySx}>
				{byline(commit)}
			</Box>
		</Box>
	);
}
