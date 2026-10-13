import { Box } from "@mui/material";
import type { ViewType } from "react-diff-view";
import type { HighLevelTreeFile } from "../../../../../../../../../../../review/highLevel/types";
import type { HighLevelDiffComments } from "../../../HighLevelDiffComments";
import { HighLevelNativeDiff } from "../../HighLevelNativeDiff";
import { HighLevelTreeFileRow } from "./HighLevelTreeFileNode/HighLevelTreeFileRow";

export function HighLevelTreeFileNode({
	file,
	indent,
	open,
	onToggle,
	viewType,
	comments,
}: {
	file: HighLevelTreeFile;
	indent: string;
	open: boolean;
	onToggle: () => void;
	viewType: ViewType;
	comments?: HighLevelDiffComments | undefined;
}) {
	return (
		<Box sx={{ minWidth: 0 }}>
			<HighLevelTreeFileRow
				file={file}
				indent={indent}
				open={open}
				onToggle={onToggle}
			/>
			{open && (
				<Box sx={{ mb: 1, minWidth: 0 }}>
					<HighLevelNativeDiff
						path={file.path}
						status={file.status}
						patch={file.patch ?? null}
						truncated={file.truncated === true}
						viewType={viewType}
						comments={comments}
					/>
				</Box>
			)}
		</Box>
	);
}
