import { contentText } from "./loadComments/contentText";
import { carryOverComments } from "./loadComments/carryOverComments";
import {
	clearPersistedComments,
	loadPersistedComments,
	type PersistedComment,
	savePersistedComments,
} from "../PersistedComment";

export function loadComments(
	requestId: string,
	supersedes: string | undefined,
	content: HTMLElement | null,
): PersistedComment[] {
	const saved = loadPersistedComments(requestId);
	if (saved.length > 0 || !supersedes || !content) return saved;
	const carried = carryOverComments(
		loadPersistedComments(supersedes),
		contentText(content),
	);
	savePersistedComments(requestId, carried);
	clearPersistedComments(supersedes);
	return carried;
}
