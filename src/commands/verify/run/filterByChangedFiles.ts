import { minimatch } from "minimatch";
import { getChangedFiles } from "./getChangedFiles";
import type { VerifyEntry } from "./VerifyEntry";

function isUnderRoot(file: string, root: string): boolean {
	return file === root || file.startsWith(`${root}/`);
}

function matchesChangedFiles(
	entry: VerifyEntry,
	changedFiles: string[],
): boolean {
	const { filter, outsideRoots } = entry;
	if (filter) return changedFiles.some((file) => minimatch(file, filter));
	if (outsideRoots)
		return changedFiles.some(
			(file) => !outsideRoots.some((root) => isUnderRoot(file, root)),
		);
	return true;
}

export function filterByChangedFiles(entries: VerifyEntry[]): VerifyEntry[] {
	const isGated = (e: VerifyEntry) => !!(e.filter || e.outsideRoots);
	if (!entries.some(isGated)) return entries;

	const changedFiles = getChangedFiles();

	return entries.filter(
		(entry) => !isGated(entry) || matchesChangedFiles(entry, changedFiles),
	);
}
