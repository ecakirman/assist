import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import type { ReleaseCommit } from "../../../../../releases/types";
import type { ReleaseCompareView } from "../useReleaseCompare";

const footSx = {
	display: "flex",
	flexWrap: "wrap",
	alignItems: "baseline",
	gap: 1.5,
	px: 1.5,
	py: 1,
	borderTop: 1,
	borderColor: "divider",
	fontSize: 12.5,
	color: "text.secondary",
} as const;

const compareLinkSx = { fontWeight: 500 } as const;

export function ReleaseQueuedFooter({
	repo,
	live,
	queued,
	view,
}: {
	repo: string;
	live: ReleaseCommit | null;
	queued: ReleaseCommit;
	view: ReleaseCompareView;
}) {
	const capped =
		view.status === "loaded" && view.compare.commits.length < view.compare.total
			? view.compare
			: null;
	if (!capped && !live) return null;

	return (
		<Box sx={footSx}>
			{capped && (
				<span>
					Showing {capped.commits.length} of {capped.total}
				</span>
			)}
			{live && (
				<Link
					sx={compareLinkSx}
					href={`https://github.com/${repo}/compare/${live.sha}...${queued.sha}`}
					target="_blank"
					rel="noreferrer"
					underline="hover"
				>
					Compare on GitHub ↗
				</Link>
			)}
		</Box>
	);
}
