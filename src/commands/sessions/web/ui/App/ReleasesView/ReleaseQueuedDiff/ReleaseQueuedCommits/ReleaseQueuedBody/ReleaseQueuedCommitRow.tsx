import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import type { ReleaseChange } from "../../../../../../releases/types";
import { formatRelativeTime } from "../../../../../formatRelativeTime";
import { changeRef } from "./ReleaseQueuedCommitRow/changeRef";
import { releaseQueuedCommitRowSx as sx } from "./ReleaseQueuedCommitRow/releaseQueuedCommitRowSx";

function byline({ author, date }: ReleaseChange): string {
	return [author, date && formatRelativeTime(date)].filter(Boolean).join(" · ");
}

export function ReleaseQueuedCommitRow({
	repo,
	change,
	live = false,
}: {
	repo: string;
	change: ReleaseChange;
	live?: boolean;
}) {
	const ref = changeRef(repo, change);

	return (
		<Box component="li" sx={sx.row(live)}>
			<Link sx={sx.ref} href={ref.href} target="_blank" rel="noreferrer">
				{ref.label}
			</Link>
			<Box component="span" sx={sx.subject} title={change.subject ?? undefined}>
				<Box component="span" sx={sx.subjectText}>
					{change.subject}
				</Box>
				{live && (
					<Box component="span" sx={sx.liveBadge}>
						live
					</Box>
				)}
			</Box>
			<Box component="span" sx={sx.by}>
				{byline(change)}
			</Box>
		</Box>
	);
}
