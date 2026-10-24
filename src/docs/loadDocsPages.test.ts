import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadDocsPages } from "./loadDocsPages";

let dir: string;

function page(id: string, extra: Record<string, unknown> = {}) {
	return JSON.stringify({
		id,
		title: id,
		group: "Getting started",
		order: 0,
		covers: [],
		sections: [{ heading: "Intro", markdown: "Hello" }],
		...extra,
	});
}

beforeEach(() => {
	dir = mkdtempSync(join(tmpdir(), "docs-pages-"));
});

afterEach(() => {
	rmSync(dir, { recursive: true, force: true });
});

describe("loadDocsPages", () => {
	it("loads every json page in the directory", () => {
		writeFileSync(join(dir, "b.json"), page("b"));
		writeFileSync(join(dir, "a.json"), page("a"));
		writeFileSync(join(dir, "notes.md"), "ignored");
		expect(loadDocsPages(dir).map((p) => p.id)).toEqual(["a", "b"]);
	});

	it("names the file when a page has an unknown key", () => {
		writeFileSync(join(dir, "bad.json"), page("bad", { draft: true }));
		expect(() => loadDocsPages(dir)).toThrow(/bad\.json/);
	});

	it("names the file when a page is not valid JSON", () => {
		writeFileSync(join(dir, "broken.json"), "{");
		expect(() => loadDocsPages(dir)).toThrow(/broken\.json: invalid JSON/);
	});

	it("rejects two pages with the same id", () => {
		writeFileSync(join(dir, "one.json"), page("same"));
		writeFileSync(join(dir, "two.json"), page("same"));
		expect(() => loadDocsPages(dir)).toThrow(/Duplicate docs page id: same/);
	});
});
