export function parseEnvPairs(
	pairs: string[],
): Record<string, string> | undefined {
	if (pairs.length === 0) return undefined;
	const env: Record<string, string> = {};
	for (const pair of pairs) {
		const eq = pair.indexOf("=");
		if (eq <= 0) {
			console.error(`--env must be KEY=VALUE, got "${pair}"`);
			process.exit(1);
		}
		env[pair.slice(0, eq)] = pair.slice(eq + 1);
	}
	return env;
}
