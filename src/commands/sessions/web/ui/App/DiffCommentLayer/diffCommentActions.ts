import type { AddRuleRequest } from "../formatAddRuleCommand";
import type { DiffComment } from "../formatDiffComment";
import { selectionActions } from "../selectionActions";
import { diffCommentFrom } from "./diffCommentActions/diffCommentFrom";
import type { DiffSelection } from "./finishDiffSelection";

export function diffCommentActions(
	pending: DiffSelection | null,
	clear: () => void,
	{
		path,
		onComment,
		onQueue,
		onAddRule,
	}: {
		path: string;
		onComment?: ((comment: DiffComment) => void) | undefined;
		onQueue?: ((comment: DiffComment) => void) | undefined;
		onAddRule?: ((request: AddRuleRequest) => void) | undefined;
	},
) {
	return selectionActions({
		path,
		pending,
		clear,
		onComment,
		onQueue,
		onAddRule,
		build: (selection, note) => diffCommentFrom(path, selection, note),
	});
}
