import { useTheme } from "@mui/material/styles";
import type { ReactElement } from "react";
import {
	Decoration,
	Diff,
	type FileData,
	Hunk,
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
	renderGap?: ((index: number) => ReactElement | null) | undefined;
}) {
	const tokens = useDiffTokens(file.hunks, path);
	const hunkHeaders = useTheme().design === "slate" && !renderGap;

	if (file.hunks.length === 0) return <BinaryNotice />;

	return (
		<Diff
			diffType={file.type}
			hunks={file.hunks}
			viewType={viewType}
			tokens={tokens}
		>
			{(hunks) => {
				const rows = hunks.flatMap((hunk, index) => {
					const gap = hunkHeaders ? (
						<Decoration key={`header ${hunk.content}`}>
							{hunk.content}
						</Decoration>
					) : (
						renderGap?.(index)
					);
					const body = <Hunk key={hunk.content} hunk={hunk} />;
					return gap ? [gap, body] : [body];
				});
				const end = renderGap?.(hunks.length);
				return end ? [...rows, end] : rows;
			}}
		</Diff>
	);
}
