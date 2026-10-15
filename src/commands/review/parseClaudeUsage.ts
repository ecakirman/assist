import { parseTokenUsage } from "./parseTokenUsage";
import type { TokenUsage } from "./TokenUsage";

export function parseClaudeUsage(usage: unknown): TokenUsage | undefined {
	return parseTokenUsage(usage, {
		cacheRead: "cache_read_input_tokens",
		cacheWrite: "cache_creation_input_tokens",
	});
}
