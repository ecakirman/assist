import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import type { SessionInfo } from "../../../../types";
import { NextSessionLinks } from "./NextItemActions/NextSessionLinks";
import { actionVariants } from "./NextItemActions/actionVariants";
import { useNextClone } from "./useNextClone";

export function NextItemActions({
	repo,
	url,
	onStart,
	sessions = [],
	size = "small",
}: {
	repo: string;
	url: string;
	onStart: (cwd: string) => void;
	sessions?: SessionInfo[];
	size?: "small" | "medium";
}) {
	const cwd = useNextClone()(repo);
	const variants = actionVariants(useTheme().design, size);
	return (
		<Stack
			direction="row"
			spacing={1}
			useFlexGap
			sx={{ flexShrink: 0, flexWrap: "wrap" }}
		>
			<NextSessionLinks sessions={sessions} size={size} />
			<Tooltip
				title={cwd ? "" : `No local clone of ${repo} to start a session in`}
			>
				<span>
					<Button
						variant={variants.start}
						size={size}
						startIcon={<PlayArrowIcon />}
						disabled={!cwd}
						onClick={() => cwd && onStart(cwd)}
					>
						Start session
					</Button>
				</span>
			</Tooltip>
			<Button
				variant={variants.link}
				size={size}
				startIcon={<OpenInNewIcon />}
				href={url}
				target="_blank"
				rel="noopener noreferrer"
			>
				GitHub
			</Button>
		</Stack>
	);
}
