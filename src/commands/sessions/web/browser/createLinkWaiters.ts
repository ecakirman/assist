export function createLinkWaiters<T>() {
	const waiters = new Set<(link: T) => void>();
	return {
		wait(timeoutMs: number, onTimeout: () => Error): Promise<T> {
			return new Promise((resolve, reject) => {
				const onLink = (link: T) => {
					clearTimeout(timer);
					waiters.delete(onLink);
					resolve(link);
				};
				const timer = setTimeout(() => {
					waiters.delete(onLink);
					reject(onTimeout());
				}, timeoutMs);
				waiters.add(onLink);
			});
		},
		notify(link: T): void {
			for (const waiter of waiters) waiter(link);
		},
	};
}
