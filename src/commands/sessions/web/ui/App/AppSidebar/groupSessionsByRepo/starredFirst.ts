export function starredFirst<T>(
	items: T[],
	isStarred: (item: T) => boolean,
): T[] {
	return [
		...items.filter((item) => isStarred(item)),
		...items.filter((item) => !isStarred(item)),
	];
}
