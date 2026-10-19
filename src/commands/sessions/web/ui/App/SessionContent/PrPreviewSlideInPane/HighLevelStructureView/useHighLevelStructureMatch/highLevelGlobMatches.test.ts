import { describe, expect, it } from "vitest";
import { highLevelGlobMatches } from "./highLevelGlobMatches";

const paths = ["README.md", "docs/guide.md", "src/app.ts", "src/app.test.ts"];

describe("highLevelGlobMatches", () => {
	it("matches nested and root files with a ** glob", () => {
		expect([...highLevelGlobMatches(paths, "**/*.md")]).toEqual([
			"README.md",
			"docs/guide.md",
		]);
	});

	it("matches a slashless glob against basenames", () => {
		expect([...highLevelGlobMatches(paths, "*.test.*")]).toEqual([
			"src/app.test.ts",
		]);
	});

	it("matches plain text as a substring of the full path", () => {
		expect([...highLevelGlobMatches(paths, "app")]).toEqual([
			"src/app.ts",
			"src/app.test.ts",
		]);
		expect([...highLevelGlobMatches(paths, "docs/gu")]).toEqual([
			"docs/guide.md",
		]);
	});

	it("matches plain text case-insensitively", () => {
		expect([...highLevelGlobMatches(paths, "readme")]).toEqual(["README.md"]);
		expect([...highLevelGlobMatches(paths, "GUIDE")]).toEqual([
			"docs/guide.md",
		]);
	});

	it("passes text with glob characters through to minimatch", () => {
		expect([...highLevelGlobMatches(paths, "app.{ts,js}")]).toEqual([
			"src/app.ts",
		]);
		expect(highLevelGlobMatches(paths, "readme*").size).toBe(0);
	});

	it("matches nothing for a blank glob", () => {
		expect(highLevelGlobMatches(paths, "  ").size).toBe(0);
	});
});
