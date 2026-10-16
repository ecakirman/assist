import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadSessionTitles, saveSessionTitle } from "./loadSessionTitles";

let storeDir: string;

beforeEach(() => {
	storeDir = mkdtempSync(join(tmpdir(), "session-titles-"));
	vi.stubEnv("ASSIST_STORE_DIR", storeDir);
	return () => vi.unstubAllEnvs();
});

describe("session title store", () => {
	it("is empty before any title is saved", () => {
		expect(loadSessionTitles()).toEqual({});
	});

	it("keeps titles keyed by harness session id", () => {
		saveSessionTitle("claude-1", "Fix the build");
		saveSessionTitle("codex-1", "Tidy docs");

		expect(loadSessionTitles()).toEqual({
			"claude-1": "Fix the build",
			"codex-1": "Tidy docs",
		});
	});

	it("replaces a renamed session's title and reports the write", () => {
		expect(saveSessionTitle("claude-1", "First")).toBe(true);
		expect(saveSessionTitle("claude-1", "First")).toBe(false);
		expect(saveSessionTitle("claude-1", "Second")).toBe(true);

		expect(loadSessionTitles()).toEqual({ "claude-1": "Second" });
	});

	it("ignores a malformed store", () => {
		writeFileSync(join(storeDir, "session-titles.json"), '{"a": 1}');

		expect(loadSessionTitles()).toEqual({});
	});
});
