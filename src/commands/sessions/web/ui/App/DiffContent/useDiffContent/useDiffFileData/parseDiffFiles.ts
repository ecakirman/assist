import { type FileData, parseDiff } from "react-diff-view";

function trimGitNameTab(path: string): string {
	return path.replace(/\t$/, "");
}

export function parseDiffFiles(diff: string): FileData[] {
	return parseDiff(diff).map((file) => ({
		...file,
		oldPath: trimGitNameTab(file.oldPath),
		newPath: trimGitNameTab(file.newPath),
	}));
}
