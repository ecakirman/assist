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

	it("matches nothing for a blank glob", () => {
		expect(highLevelGlobMatches(paths, "  ").size).toBe(0);
	});
});
