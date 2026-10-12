import Popover from "@mui/material/Popover";
import { useState } from "react";
import type { ReleaseCommit } from "../../../releases/types";
import { ReleaseQueuedCommits } from "./ReleaseQueuedDiff/ReleaseQueuedCommits";
import { ReleaseQueuedDiffButton } from "./ReleaseQueuedDiff/ReleaseQueuedDiffButton";
import { releaseQueuedDiffSx } from "./ReleaseQueuedDiff/releaseQueuedDiffSx";
import { useReleaseCompare } from "./ReleaseQueuedDiff/useReleaseCompare";

export function ReleaseQueuedDiff({
	repo,
	environment,
	live,
	queued,
	runUrl,
}: {
	repo: string;
	environment: string | null;
	live: ReleaseCommit | null;
	queued: ReleaseCommit;
	runUrl: string | null;
}) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);
	const view = useReleaseCompare(open, repo, live?.sha ?? null, queued.sha);
	const label = `Changes queued for ${environment}`;

	return (
		<>
			<ReleaseQueuedDiffButton
				environment={environment}
				open={open}
				title={label}
				onClick={(e) => setAnchorEl(open ? null : e.currentTarget)}
			/>
			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				transformOrigin={{ vertical: "top", horizontal: "center" }}
				slotProps={{
					paper: {
						sx: releaseQueuedDiffSx.paper,
						role: "dialog",
						"aria-label": label,
					},
				}}
			>
				<ReleaseQueuedCommits
					repo={repo}
					environment={environment}
					live={live}
					queued={queued}
					runUrl={runUrl}
					view={view}
				/>
			</Popover>
		</>
	);
}
