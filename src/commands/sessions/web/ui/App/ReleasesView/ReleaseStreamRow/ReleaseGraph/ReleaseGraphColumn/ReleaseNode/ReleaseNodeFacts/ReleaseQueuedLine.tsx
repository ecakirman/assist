import Box from "@mui/material/Box";
import type { ReleaseCommit } from "../../../../../../../../releases/types";
import { ReleaseCommitLink } from "../../../../ReleaseCommitLink";
import { releaseFactLineSx } from "../releaseFactLineSx";
import { ReleaseMark } from "../../../../../ReleaseMark";
import { releaseToneColors } from "../../../../../releaseToneColors";
import { ReleaseQueuedDiff } from "../../../../../ReleaseQueuedDiff";

export function ReleaseQueuedLine({
	repo,
	environment,
	live,
	commit,
}: {
	repo: string;
	environment: string | null;
	live: ReleaseCommit | null;
	commit: ReleaseCommit;
}) {
	return (
		<Box sx={releaseFactLineSx}>
			<ReleaseMark
				title="Built and queued, but not live — waiting for approval"
				color={releaseToneColors.gate}
			>
				queued
			</ReleaseMark>
			<ReleaseCommitLink
				repo={repo}
				commit={commit}
				note={`Queued for ${environment}, waiting for approval`}
			/>
			<ReleaseQueuedDiff
				repo={repo}
				environment={environment}
				live={live}
				queued={commit}
			/>
		</Box>
	);
}
