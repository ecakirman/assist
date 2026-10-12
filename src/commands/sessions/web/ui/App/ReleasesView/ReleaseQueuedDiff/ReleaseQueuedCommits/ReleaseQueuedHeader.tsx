import Box from "@mui/material/Box";
import type { ReleaseCommit } from "../../../../../releases/types";
import type { ReleaseCompareView } from "../useReleaseCompare";

const SHORT_SHA = 7;

const headSx = {
	display: "flex",
	alignItems: "baseline",
	justifyContent: "space-between",
	gap: 1.5,
	px: 1.5,
	py: 1,
	borderBottom: 1,
	borderColor: "divider",
} as const;

const titleSx = { fontWeight: 500, fontSize: 13.5 } as const;

const rangeSx = {
	fontFamily: "monospace",
	fontSize: 12,
	color: "text.secondary",
	whiteSpace: "nowrap",
} as const;

function short(sha: string): string {
	return sha.slice(0, SHORT_SHA);
}

function title(view: ReleaseCompareView, environment: string | null): string {
	if (view.status !== "loaded") return `Commits queued for ${environment}`;
	const { total } = view.compare;
	return `${total} ${total === 1 ? "commit" : "commits"} queued for ${environment}`;
}

export function ReleaseQueuedHeader({
	environment,
	live,
	queued,
	view,
}: {
	environment: string | null;
	live: ReleaseCommit | null;
	queued: ReleaseCommit;
	view: ReleaseCompareView;
}) {
	return (
		<Box sx={headSx}>
			<Box component="strong" sx={titleSx}>
				{title(view, environment)}
			</Box>
			<Box component="span" sx={rangeSx}>
				{live ? `${short(live.sha)} → ${short(queued.sha)}` : short(queued.sha)}
			</Box>
		</Box>
	);
}
