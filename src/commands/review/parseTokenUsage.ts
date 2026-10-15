import type { TokenUsage } from "./TokenUsage";

type UsageKeys = { cacheRead: string; cacheWrite?: string };

function count(value: unknown): number {
	return typeof value === "number" ? value : 0;
}

export function parseTokenUsage(
	usage: unknown,
	keys: UsageKeys,
): TokenUsage | undefined {
	if (typeof usage !== "object" || usage === null) return undefined;
	const raw = usage as Record<string, unknown>;
	const parsed: TokenUsage = {
		input: count(raw.input_tokens),
		output: count(raw.output_tokens),
		cacheRead: count(raw[keys.cacheRead]),
	};
	if (keys.cacheWrite) parsed.cacheWrite = count(raw[keys.cacheWrite]);
	return parsed;
}
