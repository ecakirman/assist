import { parseTokenUsage } from "./parseTokenUsage";
import type { TokenUsage } from "./TokenUsage";

export function parseCodexUsage(usage: unknown): TokenUsage | undefined {
	return parseTokenUsage(usage, { cacheRead: "cached_input_tokens" });
}
