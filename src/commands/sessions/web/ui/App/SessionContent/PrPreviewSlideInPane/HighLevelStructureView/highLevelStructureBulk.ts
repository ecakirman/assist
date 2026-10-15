import type { useHighLevelCollapse } from "../useHighLevelCollapse";
import type { HighLevelDiffCounts } from "../countHighLevelDiffs";

type Collapse = ReturnType<typeof useHighLevelCollapse>;

export type HighLevelStructureBulk = HighLevelDiffCounts & {
	changes: number;
	expandAll: () => void;
	collapseAll: () => void;
	show: (paths: Iterable<string>) => void;
	hide: (paths: Iterable<string>) => void;
	reset: () => void;
};

export function highLevelStructureBulk(
	dirs: Collapse,
	files: Collapse,
	dirPaths: string[],
	filePaths: string[],
	diffs: HighLevelDiffCounts,
): HighLevelStructureBulk {
	return {
		...diffs,
		changes:
			countIn(dirs.overrides, dirPaths) + countIn(files.overrides, filePaths),
		expandAll: () => {
			dirs.onSet(dirPaths, false);
			files.onSet(filePaths, false);
		},
		collapseAll: () => files.onSet(filePaths, true),
		show: (paths) => {
			const shown = [...paths];
			dirs.onSet(
				dirPaths.filter((dir) =>
					shown.some((path) => path.startsWith(`${dir}/`)),
				),
				false,
			);
			files.onSet(shown, false);
		},
		hide: (paths) => files.onSet(paths, true),
		reset: () => {
			dirs.onReset();
			files.onReset();
		},
	};
}

function countIn(overrides: ReadonlySet<string>, paths: string[]): number {
	return paths.filter((path) => overrides.has(path)).length;
}
