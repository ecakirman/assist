import { getCollapsedLinesCountBetween, type HunkData } from "react-diff-view";
import { HighLevelGapExpander } from "./gapRenderer/HighLevelGapExpander";
import type { GapExpansion } from "./useGapExpansion";

export function gapRenderer({ hunks, loading, error, expand }: GapExpansion) {
	return (hunk: HunkData, index: number) => {
		const previous = hunks[index - 1];
		if (!previous) return null;
		const hidden = getCollapsedLinesCountBetween(previous, hunk);
		if (hidden <= 0) return null;
		return (
			<HighLevelGapExpander
				key={`gap-${hunk.content}`}
				hidden={hidden}
				header={hunk.content}
				disabled={loading !== null}
				loading={loading === index}
				error={error?.index === index ? error.message : undefined}
				onExpand={() => expand(index)}
			/>
		);
	};
}
