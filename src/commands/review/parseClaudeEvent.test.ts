import { describe, expect, it } from "vitest";
import { parseClaudeEvent } from "./parseClaudeEvent";

describe("parseClaudeEvent", () => {
	it("returns ignore for invalid JSON", () => {
		expect(parseClaudeEvent("not json")).toEqual({ kind: "ignore" });
	});

	it("extracts tool uses from assistant content", () => {
		const line = JSON.stringify({
			type: "assistant",
			message: {
				content: [
					{ type: "text", text: "let me read it" },
					{
						type: "tool_use",
						name: "Read",
						input: { file_path: "src/foo.ts" },
					},
					{
						type: "tool_use",
						name: "Bash",
						input: { command: "git diff main" },
					},
				],
			},
		});
		const event = parseClaudeEvent(line);
		expect(event).toEqual({
			kind: "tool_uses",
			toolUses: [
				{ tool: "Read", summary: "src/foo.ts" },
				{ tool: "Bash", summary: "git diff main" },
			],
		});
	});

	it("returns ignore for assistant messages with no tool uses", () => {
		const line = JSON.stringify({
			type: "assistant",
			message: { content: [{ type: "text", text: "hello" }] },
		});
		expect(parseClaudeEvent(line)).toEqual({ kind: "ignore" });
	});

	it("extracts final text from result events", () => {
		const line = JSON.stringify({
			type: "result",
			subtype: "success",
			result: "# Review\n\nLooks good.",
		});
		expect(parseClaudeEvent(line)).toEqual({
			kind: "final",
			text: "# Review\n\nLooks good.",
		});
	});

	it("extracts usage from result events", () => {
		const line = JSON.stringify({
			type: "result",
			result: "done",
			usage: {
				input_tokens: 12,
				output_tokens: 340,
				cache_creation_input_tokens: 5000,
				cache_read_input_tokens: 80000,
			},
		});
		expect(parseClaudeEvent(line)).toEqual({
			kind: "final",
			text: "done",
			usage: { input: 12, output: 340, cacheRead: 80000, cacheWrite: 5000 },
		});
	});

	it("treats missing usage counts as zero", () => {
		const line = JSON.stringify({
			type: "result",
			result: "done",
			usage: { input_tokens: 7 },
		});
		expect(parseClaudeEvent(line)).toEqual({
			kind: "final",
			text: "done",
			usage: { input: 7, output: 0, cacheRead: 0, cacheWrite: 0 },
		});
	});

	it("ignores result events without string result", () => {
		const line = JSON.stringify({ type: "result", subtype: "error" });
		expect(parseClaudeEvent(line)).toEqual({ kind: "ignore" });
	});

	it("ignores unrelated event types", () => {
		const line = JSON.stringify({ type: "system", subtype: "init" });
		expect(parseClaudeEvent(line)).toEqual({ kind: "ignore" });
	});
});
