import { Box } from "@mui/material";
import type { HighLevelTestCase } from "../../../../../../../../../review/highLevel/types";
import type { HighLevelDiffComments } from "../../../HighLevelDiffComments";
import { HighLevelDiffNote } from "../../../HighLevelDiffNote";
import { HighLevelNativeDiff } from "../../../HighLevelNativeDiff";
import { testSourcePatch } from "./HighLevelTestSource/testSourcePatch";

export function HighLevelTestSource({
	test,
	path,
	indent,
	comments,
}: {
	test: HighLevelTestCase;
	path: string;
	indent: string;
	comments?: HighLevelDiffComments | undefined;
}) {
	const { source } = test;
	return (
		<Box sx={{ pl: `calc(${indent} + 20px)`, minWidth: 0 }}>
			{source === undefined ? (
				<HighLevelDiffNote>
					{test.truncated
						? "Too long to show here — open the file on GitHub."
						: test.overBudget
							? "Left out because this PR's tests are too large to show in full — open the file on GitHub."
							: "No source available."}
				</HighLevelDiffNote>
			) : (
				<HighLevelNativeDiff
					path={path}
					status="modified"
					patch={testSourcePatch(source, test.line)}
					viewType="unified"
					comments={comments}
				/>
			)}
		</Box>
	);
}
