import type { ViewType } from "react-diff-view";
import type { HighLevelTreeNode } from "../../../../../../../../review/highLevel/types";
import type { HighLevelDiffComments } from "../../HighLevelDiffComments";

export type HighLevelTreeRowsProps = {
	nodes: HighLevelTreeNode[];
	depth?: number;
	collapsed: Set<string>;
	onToggleDir: (path: string) => void;
	collapsedFiles: Set<string>;
	onToggleFile: (path: string) => void;
	fileGlobs: Map<string, string>;
	matches: Set<string>;
	viewType: ViewType;
	comments?: HighLevelDiffComments | undefined;
};
