import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findTranscriptMatch } from "./findTranscriptMatch";

function transcript(lines: unknown[]): string {
	const dir = mkdtempSync(join(tmpdir(), "history-search-"));
	const file = join(dir, "session.jsonl");
	writeFileSync(file, `${lines.map((l) => JSON.stringify(l)).join("\n")}\n`);
	return file;
}

const user = (content: unknown) => ({
	type: "user",
	message: { role: "user", content },
});
const assistant = (content: unknown) => ({
	type: "assistant",
	message: { role: "assistant", content },
});
const codex = (type: string, message: string) => ({
	type: "event_msg",
	payload: { type, message },
});

describe("findTranscriptMatch", () => {
	it("finds a match in the first user message", async () => {
		const file = transcript([user("fix the flaky widget test")]);

		expect(await findTranscriptMatch(file, undefined, "flaky")).toEqual({
			before: "fix the ",
			match: "flaky",
			after: " widget test",
		});
	});

	it("finds a match beyond the 16 KB head", async () => {
		const filler = Array.from({ length: 40 }, (_, i) =>
			assistant([{ type: "text", text: `padding ${i} ${"x".repeat(1000)}` }]),
		);
		const file = transcript([
			user("start"),
			...filler,
			assistant([{ type: "text", text: "the culprit was a stale cache" }]),
		]);

		const snippet = await findTranscriptMatch(file, undefined, "stale cache");

		expect(snippet?.match).toBe("stale cache");
	});

	it("matches case-insensitively and keeps the transcript's casing", async () => {
		const file = transcript([user("Rename the WebSocket handler")]);

		const snippet = await findTranscriptMatch(file, undefined, "websocket");

		expect(snippet?.match).toBe("WebSocket");
	});

	it("reports the first match in transcript order", async () => {
		const file = transcript([
			user("first mention of deploy"),
			assistant([{ type: "text", text: "second deploy" }]),
		]);

		const snippet = await findTranscriptMatch(file, undefined, "deploy");

		expect(snippet?.before).toBe("first mention of ");
	});

	it("ignores tool calls and their results", async () => {
		const file = transcript([
			assistant([
				{ type: "tool_use", name: "Bash", input: { command: "grep needle" } },
			]),
			user([{ type: "tool_result", content: "needle found" }]),
		]);

		expect(await findTranscriptMatch(file, undefined, "needle")).toBeNull();
	});

	it("matches text that JSON escapes", async () => {
		const file = transcript([user('say "hello"\nworld')]);

		const snippet = await findTranscriptMatch(file, undefined, '"hello"');

		expect(snippet?.match).toBe('"hello"');
	});

	it("bounds the snippet around the match", async () => {
		const text = `${"a".repeat(200)} needle ${"b".repeat(200)}`;
		const file = transcript([user(text)]);

		const snippet = await findTranscriptMatch(file, undefined, "needle");

		expect(snippet?.before.startsWith("…")).toBe(true);
		expect(snippet?.after.endsWith("…")).toBe(true);
		expect(snippet?.before.length).toBeLessThanOrEqual(61);
		expect(snippet?.after.length).toBeLessThanOrEqual(61);
	});

	it("collapses newlines in the snippet", async () => {
		const file = transcript([user("line one\n\nneedle\nline three")]);

		expect(await findTranscriptMatch(file, undefined, "needle")).toEqual({
			before: "line one ",
			match: "needle",
			after: " line three",
		});
	});

	it("searches Codex user and agent messages", async () => {
		const file = transcript([
			{ type: "session_meta", payload: { session_id: "c1", cwd: "/repo" } },
			codex("user_message", "what time is it"),
			codex("agent_message", "It is nine o'clock"),
		]);

		expect((await findTranscriptMatch(file, "codex", "NINE"))?.match).toBe(
			"nine",
		);
		expect((await findTranscriptMatch(file, "codex", "what time"))?.match).toBe(
			"what time",
		);
	});

	it("returns null when nothing matches", async () => {
		const file = transcript([user("hello"), assistant("hi there")]);

		expect(await findTranscriptMatch(file, undefined, "absent")).toBeNull();
	});

	it("returns null for a missing file", async () => {
		expect(
			await findTranscriptMatch("/nonexistent/x.jsonl", undefined, "a"),
		).toBeNull();
	});
});
