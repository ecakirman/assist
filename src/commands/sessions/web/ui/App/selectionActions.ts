import type { AddRuleRequest } from "./formatAddRuleCommand";

export function selectionActions<Pending extends { quote: string }, Comment>({
	path,
	pending,
	clear,
	onComment,
	onQueue,
	onAddRule,
	build,
}: {
	path: string;
	pending: Pending | null;
	clear: () => void;
	onComment?: ((comment: Comment) => void) | undefined;
	onQueue?: ((comment: Comment) => void) | undefined;
	onAddRule?: ((request: AddRuleRequest) => void) | undefined;
	build: (pending: Pending, note: string) => Comment;
}): {
	add: (note: string) => void;
	queue: ((note: string) => void) | undefined;
	addRule: ((note: string) => void) | undefined;
} {
	const deliver =
		(to: ((comment: Comment) => void) | undefined) => (note: string) => {
			if (pending && to) to(build(pending, note));
			clear();
		};

	const addRule = (note: string) => {
		if (pending && onAddRule) onAddRule({ path, quote: pending.quote, note });
		clear();
	};

	return {
		add: deliver(onComment),
		queue: onQueue ? deliver(onQueue) : undefined,
		addRule: onAddRule ? addRule : undefined,
	};
}
