import { describe, expect, it } from "vitest";
import { parseCodexEvent } from "./parseCodexEvent";

describe("parseCodexEvent", () => {
	it("returns ignore for invalid JSON", () => {
		expect(parseCodexEvent("not json")).toEqual({ kind: "ignore" });
	});

	it("extracts shell tool use from command_execution start", () => {
		const line = JSON.stringify({
			type: "item.started",
			item: {
				id: "item_1",
				type: "command_execution",
				command: `/bin/bash -lc "sed -n '1,220p' README.md"`,
			},
		});
		expect(parseCodexEvent(line)).toEqual({
			kind: "tool_use",
			tool: "shell",
			summary: "sed -n '1,220p' README.md",
		});
	});

	it("returns ignore for non-shell item starts", () => {
		const line = JSON.stringify({
			type: "item.started",
			item: { id: "x", type: "agent_message" },
		});
		expect(parseCodexEvent(line)).toEqual({ kind: "ignore" });
	});

	it("returns ignore for item.completed events", () => {
		const line = JSON.stringify({
			type: "item.completed",
			item: { id: "item_1", type: "command_execution", command: "ls" },
		});
		expect(parseCodexEvent(line)).toEqual({ kind: "ignore" });
	});

	it("extracts usage from turn.completed", () => {
		const line = JSON.stringify({
			type: "turn.completed",
			usage: {
				input_tokens: 1200,
				cached_input_tokens: 800,
				output_tokens: 90,
			},
		});
		expect(parseCodexEvent(line)).toEqual({
			kind: "usage",
			usage: { input: 1200, output: 90, cacheRead: 800 },
		});
	});

	it("returns ignore for turn.completed without usage", () => {
		expect(parseCodexEvent(JSON.stringify({ type: "turn.completed" }))).toEqual(
			{ kind: "ignore" },
		);
	});

	it("returns ignore for thread.started", () => {
		expect(
			parseCodexEvent(
				JSON.stringify({ type: "thread.started", thread_id: "x" }),
			),
		).toEqual({ kind: "ignore" });
	});
});
