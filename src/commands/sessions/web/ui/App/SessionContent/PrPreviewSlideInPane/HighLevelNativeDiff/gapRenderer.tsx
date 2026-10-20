import { gapAt } from "./gapAt";
import { HighLevelGapExpander } from "./gapRenderer/HighLevelGapExpander";
import type { GapExpansion } from "./useGapExpansion";

export function gapRenderer({
	hunks,
	headLength,
	loading,
	error,
	expand,
}: GapExpansion) {
	return (index: number) => {
		const gap = gapAt(hunks, index, headLength);
		if (!gap) return null;
		return (
			<HighLevelGapExpander
				key={`gap-${hunks[index]?.content ?? "end"}`}
				gap={gap}
				header={hunks[index]?.content}
				disabled={loading !== null}
				loading={loading === index}
				error={error?.index === index ? error.message : undefined}
				onExpand={(direction) => expand(index, direction)}
				onRetry={() => error && expand(error.index, error.direction)}
			/>
		);
	};
}
