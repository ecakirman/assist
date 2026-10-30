import Box from "@mui/material/Box";
import { type ReactNode, useMemo } from "react";
import type { HunkData } from "react-diff-view";
import { buildChangeIndex } from "./DiffCommentLayer/buildChangeIndex";
import { diffCommentActions } from "./DiffCommentLayer/diffCommentActions";
import { CommentPopover } from "./CommentPopover";
import { DragOverlay } from "./DragOverlay";
import type { AddRuleRequest } from "./formatAddRuleCommand";
import type { DiffComment } from "./formatDiffComment";
import { selectionLayerSx } from "./selectionLayerSx";
import { useDiffSelection } from "./DiffCommentLayer/useDiffSelection";
import { useSelectionColor } from "./DiffCommentLayer/useSelectionColor";

export function DiffCommentLayer({
	cwd,
	hunks,
	unavailable,
	children,
	...targets
}: {
	path: string;
	cwd?: string | undefined;
	hunks: HunkData[];
	onComment?: ((comment: DiffComment) => void) | undefined;
	onQueue?: ((comment: DiffComment) => void) | undefined;
	onAddRule?: ((request: AddRuleRequest) => void) | undefined;
	unavailable?: string | undefined;
	children: ReactNode;
}) {
	const selectionColor = useSelectionColor();
	const index = useMemo(() => buildChangeIndex(hunks), [hunks]);
	const { wrapperRef, contentRef, pending, rects, onMouseDown, clear } =
		useDiffSelection(index);

	if (!targets.onComment && !targets.onQueue && !unavailable)
		return <>{children}</>;

	const { add, queue, addRule } = diffCommentActions(pending, clear, targets);

	return (
		<Box ref={wrapperRef} onMouseDown={onMouseDown} sx={selectionLayerSx}>
			<Box ref={contentRef}>{children}</Box>
			<DragOverlay rects={rects} color={selectionColor} />
			<CommentPopover
				pending={pending}
				moved={pending?.moved}
				cwd={cwd}
				path={targets.path}
				unavailable={unavailable}
				onAdd={add}
				onQueue={queue}
				onAddRule={addRule}
				onCancel={clear}
			/>
		</Box>
	);
}
