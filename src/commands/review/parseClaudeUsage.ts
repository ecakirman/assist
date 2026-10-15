import type { TokenUsage } from "./TokenUsage";

function count(value: unknown): number {
	return typeof value === "number" ? value : 0;
}

export function parseClaudeUsage(usage: unknown): TokenUsage | undefined {
	if (typeof usage !== "object" || usage === null) return undefined;
	const raw = usage as Record<string, unknown>;
	return {
		input: count(raw.input_tokens),
		output: count(raw.output_tokens),
		cacheRead: count(raw.cache_read_input_tokens),
		cacheWrite: count(raw.cache_creation_input_tokens),
	};
}
