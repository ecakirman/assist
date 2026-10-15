import { Typography } from "@mui/material";
import type { HighLevelTreeDir } from "../../../../../../../../../../review/highLevel/types";
import { flattenHighLevelTree } from "../../../flattenHighLevelTree";

export function HighLevelTreeHiddenCount({ dir }: { dir: HighLevelTreeDir }) {
	const hidden = flattenHighLevelTree(dir.children).length;
	return (
		<Typography
			component="span"
			variant="caption"
			sx={{ color: "text.secondary", flexShrink: 0 }}
		>
			{hidden} {hidden === 1 ? "file" : "files"} hidden
		</Typography>
	);
}
