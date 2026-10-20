import { useContext, useState } from "react";
import type { HunkData } from "react-diff-view";
import { expandGap } from "./useGapExpansion/expandGap";
import { highLevelHeadSourceContext } from "../highLevelHeadSourceContext";

type Expanded = { base: HunkData[]; hunks: HunkData[] };

export type GapExpansion = {
	hunks: HunkData[];
	expandable: boolean;
	loading: number | null;
	error: { index: number; message: string } | null;
	expand: (index: number) => void;
};

export function useGapExpansion(path: string, base: HunkData[]): GapExpansion {
	const source = useContext(highLevelHeadSourceContext);
	const [expanded, setExpanded] = useState<Expanded | null>(null);
	const [loading, setLoading] = useState<number | null>(null);
	const [error, setError] = useState<GapExpansion["error"]>(null);
	const hunks = expanded?.base === base ? expanded.hunks : base;

	const expand = (index: number) => {
		if (!source) return;
		setLoading(index);
		setError(null);
		source
			.load(path)
			.then((lines) =>
				setExpanded((previous) => ({
					base,
					hunks: expandGap(
						previous?.base === base ? previous.hunks : base,
						lines,
						index,
					),
				})),
			)
			.catch((error: unknown) =>
				setError({
					index,
					message: error instanceof Error ? error.message : String(error),
				}),
			)
			.finally(() => setLoading(null));
	};

	return { hunks, expandable: source !== undefined, loading, error, expand };
}
