import Box from "@mui/material/Box";
import type { ReleaseCommit } from "../../../../../releases/types";
import { ReleaseQueuedCommitRow } from "./ReleaseQueuedBody/ReleaseQueuedCommitRow";
import { ReleaseQueuedSkeleton } from "./ReleaseQueuedBody/ReleaseQueuedSkeleton";
import type { ReleaseCompareView } from "../useReleaseCompare";

const errorSx = {
	px: 1.5,
	py: 2,
	fontSize: 13,
	lineHeight: 1.5,
	color: "error.main",
} as const;

const listSx = {
	listStyle: "none",
	m: 0,
	py: 0.5,
	px: 0,
	maxHeight: 296,
	overflowY: "auto",
} as const;

export function ReleaseQueuedBody({
	repo,
	live,
	view,
}: {
	repo: string;
	live: ReleaseCommit | null;
	view: ReleaseCompareView;
}) {
	if (view.status === "loading") return <ReleaseQueuedSkeleton />;
	if (view.status === "error")
		return (
			<Box sx={errorSx}>
				Couldn't load the commit range from GitHub. Check{" "}
				<code>gh auth status</code>, then try again.
			</Box>
		);
	const { total, commits } = view.compare;
	return (
		<Box component="ol" sx={listSx}>
			{commits.map((commit) => (
				<ReleaseQueuedCommitRow key={commit.sha} repo={repo} commit={commit} />
			))}
			{live && commits.length >= total && (
				<ReleaseQueuedCommitRow
					repo={repo}
					commit={{ ...live, date: null }}
					live
				/>
			)}
		</Box>
	);
}
