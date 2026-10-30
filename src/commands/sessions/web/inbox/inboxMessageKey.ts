export function inboxMessageKey(source: string, messageId: string): string {
	return `${source}:${messageId}`;
}

export function parseInboxMessageKey(
	key: string,
): { source: string; messageId: string } | undefined {
	const separator = key.indexOf(":");
	if (separator <= 0 || separator === key.length - 1) return undefined;
	return {
		source: key.slice(0, separator),
		messageId: key.slice(separator + 1),
	};
}
