import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clearHighLevelDraft } from "./clearHighLevelDraft";
import { loadHighLevelDraft } from "./loadHighLevelDraft";
import { loadHighLevelReview } from "./loadHighLevelReview";
import { saveHighLevelDraft } from "./saveHighLevelDraft";
import type { HighLevelReviewDraft } from "./types";

const draft: HighLevelReviewDraft = {
	repo: "org/repo",
	prNumber: 42,
	headRef: "feat/thing",
	headSha: "abc123",
	savedAt: "2026-01-01T00:00:00.000Z",
	items: [],
	reviewComments: [
		{ path: "src/a.ts", startLine: 4, endLine: 4, quote: "x", note: "why" },
	],
};

let store: string;
const original = process.env.ASSIST_STORE_DIR;

beforeEach(() => {
	store = mkdtempSync(join(tmpdir(), "assist-high-level-"));
	process.env.ASSIST_STORE_DIR = store;
});

afterEach(() => {
	if (original === undefined) delete process.env.ASSIST_STORE_DIR;
	else process.env.ASSIST_STORE_DIR = original;
});

describe("loadHighLevelDraft", () => {
	it("reads back a saved draft for the same head without recording a review", () => {
		const path = saveHighLevelDraft(draft);

		expect(path).toBe(
			join(
				store,
				"high-level-reviews",
				"org-repo",
				"feat-thing-abc123.draft.json",
			),
		);
		expect(loadHighLevelDraft("org/repo", "feat/thing", "abc123")).toEqual(
			draft,
		);
		expect(loadHighLevelReview("org/repo", "feat/thing", "abc123")).toBe(
			undefined,
		);
	});

	it("returns undefined for another head or once cleared", () => {
		saveHighLevelDraft(draft);

		expect(loadHighLevelDraft("org/repo", "feat/thing", "def456")).toBe(
			undefined,
		);
		clearHighLevelDraft("org/repo", "feat/thing", "abc123");
		expect(loadHighLevelDraft("org/repo", "feat/thing", "abc123")).toBe(
			undefined,
		);
	});
});
