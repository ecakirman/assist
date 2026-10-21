export function extractRepeatedOption(
	args: string[],
	flag: string,
): { values: string[]; remaining: string[] } {
	const values: string[] = [];
	const remaining: string[] = [];
	for (let i = 0; i < args.length; i++) {
		if (args[i] === flag && i + 1 < args.length) {
			values.push(args[++i]);
		} else {
			remaining.push(args[i]);
		}
	}
	return { values, remaining };
}
