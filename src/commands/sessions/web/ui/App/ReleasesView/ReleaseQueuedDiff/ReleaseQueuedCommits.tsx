import type { ReleaseCommit } from "../../../../releases/types";
import { ReleaseQueuedBody } from "./ReleaseQueuedCommits/ReleaseQueuedBody";
import { ReleaseQueuedFooter } from "./ReleaseQueuedCommits/ReleaseQueuedFooter";
import { ReleaseQueuedHeader } from "./ReleaseQueuedCommits/ReleaseQueuedHeader";
import type { ReleaseCompareView } from "./useReleaseCompare";

export function ReleaseQueuedCommits({
	repo,
	environment,
	live,
	queued,
	view,
}: {
	repo: string;
	environment: string | null;
	live: ReleaseCommit | null;
	queued: ReleaseCommit;
	view: ReleaseCompareView;
}) {
	return (
		<>
			<ReleaseQueuedHeader
				environment={environment}
				live={live}
				queued={queued}
				view={view}
			/>
			<ReleaseQueuedBody repo={repo} live={live} view={view} />
			<ReleaseQueuedFooter
				repo={repo}
				live={live}
				queued={queued}
				view={view}
			/>
		</>
	);
}
