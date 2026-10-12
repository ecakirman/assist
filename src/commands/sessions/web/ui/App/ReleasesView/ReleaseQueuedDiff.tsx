import DifferenceOutlinedIcon from "@mui/icons-material/DifferenceOutlined";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import { useState } from "react";
import type { ReleaseCommit } from "../../../releases/types";
import { ReleaseQueuedCommits } from "./ReleaseQueuedDiff/ReleaseQueuedCommits";
import { releaseQueuedDiffSx } from "./ReleaseQueuedDiff/releaseQueuedDiffSx";
import { useReleaseCompare } from "./ReleaseQueuedDiff/useReleaseCompare";

export function ReleaseQueuedDiff({
	repo,
	environment,
	live,
	queued,
}: {
	repo: string;
	environment: string | null;
	live: ReleaseCommit | null;
	queued: ReleaseCommit;
}) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);
	const view = useReleaseCompare(open, repo, live?.sha ?? null, queued.sha);
	const label = `Changes queued for ${environment}`;

	return (
		<>
			<IconButton
				sx={releaseQueuedDiffSx.button}
				aria-label={`Show changes queued for ${environment}`}
				aria-expanded={open}
				aria-haspopup="dialog"
				title={label}
				onClick={(e) => setAnchorEl(open ? null : e.currentTarget)}
			>
				<DifferenceOutlinedIcon sx={releaseQueuedDiffSx.icon} />
			</IconButton>
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
					view={view}
				/>
			</Popover>
		</>
	);
}
