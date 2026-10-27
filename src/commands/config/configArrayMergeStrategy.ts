type ConfigArrayMergeStrategy =
	| { kind: "keyed"; field: string }
	| { kind: "replace" };

const STRATEGIES: Record<string, ConfigArrayMergeStrategy> = {
	run: { kind: "keyed", field: "name" },
	deny: { kind: "keyed", field: "pattern" },
};

export function configArrayMergeStrategy(
	key: string,
): ConfigArrayMergeStrategy {
	return STRATEGIES[key] ?? { kind: "replace" };
}
