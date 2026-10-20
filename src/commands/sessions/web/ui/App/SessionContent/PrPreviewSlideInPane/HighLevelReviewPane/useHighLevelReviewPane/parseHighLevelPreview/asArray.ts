export function asArray<T>(
	value: unknown,
	guard?: (item: unknown) => item is T,
): T[] {
	if (!Array.isArray(value)) return [];
	return guard ? value.filter(guard) : (value as T[]);
}
