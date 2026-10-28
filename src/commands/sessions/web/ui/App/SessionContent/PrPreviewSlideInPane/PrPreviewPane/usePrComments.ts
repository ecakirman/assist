import {
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	type PersistedComment,
	prunePersistedComments,
	savePersistedComments,
} from "./PersistedComment";
import { loadComments } from "./usePrComments/loadComments";

export type LocalComment = PersistedComment & { id: number };

export function usePrComments(
	requestId: string,
	supersedes: string | undefined,
	contentRef: RefObject<HTMLElement | null>,
) {
	const [comments, setComments] = useState<LocalComment[]>([]);
	const nextId = useRef(0);

	useEffect(() => {
		prunePersistedComments();
		setComments(
			loadComments(requestId, supersedes, contentRef.current).map((p) => ({
				...p,
				id: nextId.current++,
			})),
		);
	}, [requestId, supersedes, contentRef]);

	const add = useCallback(
		(comment: PersistedComment) => {
			setComments((cs) => {
				const next = [...cs, { ...comment, id: nextId.current++ }];
				savePersistedComments(requestId, next);
				return next;
			});
		},
		[requestId],
	);

	const remove = useCallback(
		(id: number) => {
			setComments((cs) => {
				const next = cs.filter((c) => c.id !== id);
				savePersistedComments(requestId, next);
				return next;
			});
		},
		[requestId],
	);

	return { comments, add, remove };
}
