function adviceRules(raw: Record<string, unknown>): unknown[] | undefined {
	const advice = raw.advice as Record<string, unknown> | undefined;
	return Array.isArray(advice?.rules) ? advice.rules : undefined;
}

export function mergeAdviceRules(
	globalRaw: Record<string, unknown>,
	projectRaw: Record<string, unknown>,
): unknown[] | undefined {
	const globalRules = adviceRules(globalRaw);
	const projectRules = adviceRules(projectRaw);
	if (!globalRules || !projectRules) return undefined;
	return [...globalRules, ...projectRules];
}
