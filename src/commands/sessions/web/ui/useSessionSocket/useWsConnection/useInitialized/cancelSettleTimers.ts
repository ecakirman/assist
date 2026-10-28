export function cancelSettleTimers(
	timers: Map<string, ReturnType<typeof setTimeout>>,
	ids: string[],
): void {
	for (const id of ids) {
		clearTimeout(timers.get(id));
		timers.delete(id);
	}
}
