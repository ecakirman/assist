import type { HighLevelFile } from "../../commands/review/highLevel/types";
import type { CaptureHighLevelFile } from "../captureSetupStepSchema";

const REPO = "staff0rd/sandbox";

export function highLevelFile(
	file: CaptureHighLevelFile,
	prNumber: number,
): HighLevelFile {
	const patch = patchOf(file);
	return {
		path: file.path,
		status: file.status,
		additions: countLines(patch, "+"),
		deletions: countLines(patch, "-"),
		diffUrl: `https://github.com/${REPO}/pull/${prNumber}/files`,
		...(patch === undefined ? {} : { patch }),
	};
}

function patchOf(file: CaptureHighLevelFile): string | undefined {
	if (file.patch !== undefined || file.content === undefined) return file.patch;
	const lines = file.content.replace(/\n$/, "").split("\n");
	return [
		`@@ -0,0 +1,${lines.length} @@`,
		...lines.map((line) => `+${line}`),
	].join("\n");
}

function countLines(patch: string | undefined, marker: string): number {
	return (patch ?? "")
		.split("\n")
		.filter((line) => line.startsWith(marker) && !line.startsWith("@@")).length;
}
