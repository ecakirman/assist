import LaunchIcon from "@mui/icons-material/Launch";
import { IconButton } from "@mui/material";
import type { HighLevelTreeFile } from "../../../../../../../../../../../../../review/highLevel/types";

export function HighLevelTreeFileLink({ file }: { file: HighLevelTreeFile }) {
	return (
		<IconButton
			size="small"
			href={file.diffUrl}
			target="_blank"
			rel="noreferrer"
			aria-label={`Open ${file.path} on GitHub`}
			sx={{ p: 0.25, flexShrink: 0 }}
		>
			<LaunchIcon sx={{ fontSize: 14 }} />
		</IconButton>
	);
}
