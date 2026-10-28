export function useCommentNoteSubmit({
	trimmed,
	unavailable,
	onAdd,
	onQueue,
}: {
	trimmed: string;
	unavailable: string | undefined;
	onAdd: (note: string) => void;
	onQueue: ((note: string) => void) | undefined;
}) {
	const submit = () => {
		if (trimmed && !unavailable) onAdd(trimmed);
	};
	const submitDefault = () => {
		if (trimmed && unavailable && onQueue) onQueue(trimmed);
		else submit();
	};
	return { submit, submitDefault };
}
