import type { ReactElement } from "react";
import {
	Diff,
	type FileData,
	Hunk,
	type HunkData,
	type ViewType,
} from "react-diff-view";
import { BinaryNotice } from "./FileDiffBody/BinaryNotice";
import { useDiffTokens } from "./FileDiffBody/useDiffTokens";

export function FileDiffBody({
	file,
	path,
	viewType,
	renderGap,
}: {
	file: FileData;
	path: string;
	viewType: ViewType;
	renderGap?:
		| ((hunk: HunkData, index: number) => ReactElement | null)
		| undefined;
}) {
	const tokens = useDiffTokens(file.hunks, path);

	if (file.hunks.length === 0) return <BinaryNotice />;

	return (
		<Diff
			diffType={file.type}
			hunks={file.hunks}
			viewType={viewType}
			tokens={tokens}
		>
			{(hunks) =>
				hunks.flatMap((hunk, index) => {
					const gap = renderGap?.(hunk, index);
					const body = <Hunk key={hunk.content} hunk={hunk} />;
					return gap ? [gap, body] : [body];
				})
			}
		</Diff>
	);
}
