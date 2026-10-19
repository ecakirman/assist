import { CommentUnavailablePopover } from "./CommentPopover/CommentUnavailablePopover";
import { ruleCitationNote } from "./ruleCitationNote";
import {
	type SelectionAnchor,
	SelectionCommentPopover,
} from "./SelectionCommentPopover";

export function CommentPopover({
	pending,
	moved,
	cwd,
	path,
	unavailable,
	onAdd,
	onQueue,
	onAddRule,
	onCancel,
}: {
	pending: SelectionAnchor | null;
	moved?: boolean | undefined;
	cwd: string | undefined;
	path: string;
	unavailable: string | undefined;
	onAdd: (note: string) => void;
	onQueue?: ((note: string) => void) | undefined;
	onAddRule: ((note: string) => void) | undefined;
	onCancel: () => void;
}) {
	if (unavailable && !onQueue)
		return (
			<CommentUnavailablePopover
				pending={pending}
				message={unavailable}
				onClose={onCancel}
			/>
		);

	return (
		<SelectionCommentPopover
			pending={pending}
			moved={moved}
			cwd={cwd}
			path={path}
			unavailable={unavailable}
			onAdd={onAdd}
			onQueue={onQueue}
			onCite={unavailable ? undefined : (rule) => onAdd(ruleCitationNote(rule))}
			onAddRule={onAddRule}
			onCancel={onCancel}
		/>
	);
}
