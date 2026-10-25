import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { lastWriteTimes } from "./lastWriteTimes";

function toolUse(timestamp: string, name: string, input: object) {
	return JSON.stringify({
		type: "assistant",
		timestamp,
		message: { content: [{ type: "tool_use", name, input }] },
	});
}

function transcript(lines: string[]): string {
	const path = join(mkdtempSync(join(tmpdir(), "last-write-")), "t.jsonl");
	writeFileSync(path, lines.join("\n"));
	return path;
}

const target = {
	file: "docs/guide/pages/start.json",
	within: "docs/guide/",
};

describe("lastWriteTimes", () => {
	it("finds the newest write to the file and to anything within the directory", () => {
		const path = transcript([
			toolUse("2026-10-25T01:00:00Z", "Edit", {
				file_path: "/r/docs/guide/pages/start.json",
			}),
			toolUse("2026-10-25T02:00:00Z", "Write", {
				file_path: "/r/docs/guide/styles.css",
			}),
			toolUse("2026-10-25T03:00:00Z", "Read", {
				file_path: "/r/docs/guide/pages/start.json",
			}),
			"not json with tool_use",
		]);
		return expect(lastWriteTimes(path, target)).resolves.toEqual({
			file: Date.parse("2026-10-25T01:00:00Z"),
			within: Date.parse("2026-10-25T02:00:00Z"),
		});
	});

	it("reports nothing for a session that never wrote docs or has no transcript", async () => {
		const path = transcript([
			toolUse("2026-10-25T01:00:00Z", "Edit", { file_path: "/r/src/a.ts" }),
		]);
		expect(await lastWriteTimes(path, target)).toEqual({});
		expect(await lastWriteTimes("/missing.jsonl", target)).toEqual({});
	});
});
