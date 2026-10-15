import { describe, expect, it } from "vitest";
import { createCodexLineHandler } from "./createCodexLineHandler";

function turn(input: number, cached: number, output: number): string {
	return JSON.stringify({
		type: "turn.completed",
		usage: {
			input_tokens: input,
			cached_input_tokens: cached,
			output_tokens: output,
		},
	});
}

describe("createCodexLineHandler", () => {
	it("sums usage across turns without a cache write figure", () => {
		const { state, onLine } = createCodexLineHandler("r", undefined, undefined);
		onLine(turn(100, 40, 10));
		onLine(JSON.stringify({ type: "thread.started", thread_id: "x" }));
		onLine(turn(200, 150, 25));
		expect(state.usage).toEqual({ input: 300, output: 35, cacheRead: 190 });
	});

	it("leaves usage unset when no turn reports it", () => {
		const { state, onLine } = createCodexLineHandler("r", undefined, undefined);
		onLine(JSON.stringify({ type: "turn.completed" }));
		expect(state.usage).toBeUndefined();
	});
});
