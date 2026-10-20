import { useContext, useState } from "react";
import type { HunkData } from "react-diff-view";
import type { GapDirection } from "./gapAt";
import { type Expanded, expandedFrom } from "./useGapExpansion/expandedFrom";
import { highLevelHeadSourceContext } from "../highLevelHeadSourceContext";

export type GapExpansion = {
	hunks: HunkData[];
	headLength: number | undefined;
	expandable: boolean;
	loading: number | null;
	error: { index: number; direction: GapDirection; message: string } | null;
	expand: (index: number, direction: GapDirection) => void;
};

export function useGapExpansion(
	path: string,
	base: HunkData[],
	enabled: boolean,
): GapExpansion {
	const source = useContext(highLevelHeadSourceContext);
	const [expanded, setExpanded] = useState<Expanded | null>(null);
	const [headLength, setHeadLength] = useState<number>();
	const [loading, setLoading] = useState<number | null>(null);
	const [error, setError] = useState<GapExpansion["error"]>(null);
	const hunks = expanded?.base === base ? expanded.hunks : base;

	const expand = (index: number, direction: GapDirection) => {
		if (!source) return;
		setLoading(index);
		setError(null);
		source
			.load(path)
			.then((lines) => {
				setHeadLength(lines.length);
				setExpanded((previous) =>
					expandedFrom(previous, base, lines, index, direction),
				);
			})
			.catch((error: unknown) =>
				setError({
					index,
					direction,
					message: error instanceof Error ? error.message : String(error),
				}),
			)
			.finally(() => setLoading(null));
	};

	return {
		hunks,
		headLength,
		expandable: enabled && source !== undefined,
		loading,
		error,
		expand,
	};
}
