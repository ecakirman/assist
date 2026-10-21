export function extractFlag(
	args: string[],
	flag: string,
): { present: boolean; remaining: string[] } {
	const remaining = args.filter((arg) => arg !== flag);
	return { present: remaining.length < args.length, remaining };
}
