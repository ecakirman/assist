import { useMemo } from "react";
import type { FileData } from "react-diff-view";
import { type DiffChangeType, filterDiffFiles } from "../filterDiffFiles";
import { orderFilesByTree } from "./useDiffFileData/orderFilesByTree";
import { parseDiffFiles } from "./useDiffFileData/parseDiffFiles";

export function useDiffFileData({
	diff,
	error,
	search,
	changeType,
}: {
	diff: string;
	error: boolean;
	search: string;
	changeType: DiffChangeType;
}): { files: FileData[]; visibleFiles: FileData[] } {
	const files = useMemo(
		() => (error || !diff ? [] : parseDiffFiles(diff)),
		[diff, error],
	);
	const visibleFiles = useMemo(
		() =>
			orderFilesByTree(filterDiffFiles(files, { query: search, changeType })),
		[files, search, changeType],
	);

	return { files, visibleFiles };
}
