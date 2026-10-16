import {
	appendFileSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { trimDaemonLog } from "./trimDaemonLog";

describe("trimDaemonLog", () => {
	let dir: string;
	let path: string;

	beforeEach(() => {
		dir = mkdtempSync(join(tmpdir(), "trim-daemon-log-"));
		path = join(dir, "daemon.log");
	});

	afterEach(() => {
		rmSync(dir, { recursive: true, force: true });
	});

	it("leaves a log at or under the threshold untouched", () => {
		writeFileSync(path, "line one\nline two\n");

		expect(trimDaemonLog({ path, maxBytes: 18, keepBytes: 5 })).toBeUndefined();
		expect(readFileSync(path, "utf8")).toBe("line one\nline two\n");
	});

	it("returns undefined when the log does not exist", () => {
		expect(trimDaemonLog({ path, maxBytes: 1, keepBytes: 1 })).toBeUndefined();
	});

	it("keeps only the newest bytes of a log over the threshold", () => {
		const lines = Array.from({ length: 100 }, (_, i) => `line ${i}`);
		writeFileSync(path, `${lines.join("\n")}\n`);

		const result = trimDaemonLog({ path, maxBytes: 200, keepBytes: 100 });

		const content = readFileSync(path, "utf8");
		expect(result).toMatchObject({ after: content.length });
		expect(content.length).toBeLessThanOrEqual(100);
		expect(content.endsWith("line 99\n")).toBe(true);
	});

	it("starts the kept content at a whole line", () => {
		writeFileSync(path, "aaaaaaaaaa\nbbbbbbbbbb\ncccccccccc\n");

		trimDaemonLog({ path, maxBytes: 20, keepBytes: 15 });

		expect(readFileSync(path, "utf8")).toBe("cccccccccc\n");
	});

	it("lets an append-mode writer continue at the new end", () => {
		writeFileSync(path, "aaaaaaaaaa\nbbbbbbbbbb\ncccccccccc\n");

		trimDaemonLog({ path, maxBytes: 20, keepBytes: 15 });
		appendFileSync(path, "dddd\n");

		expect(readFileSync(path, "utf8")).toBe("cccccccccc\ndddd\n");
	});
});
