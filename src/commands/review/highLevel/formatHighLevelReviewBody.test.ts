import { describe, expect, it } from "vitest";
import { formatHighLevelReviewBody } from "./formatHighLevelReviewBody";
import type { HighLevelReviewItem } from "./types";

function item(overrides: Partial<HighLevelReviewItem>): HighLevelReviewItem {
	return {
		id: "structure-sensible",
		kind: "manual",
		title: "The structure of the change is sensible",
		status: "manual",
		reason: "The changed-file tree",
		ticked: true,
		...overrides,
	};
}

describe("formatHighLevelReviewBody", () => {
	it("is empty when no comments were left", () => {
		expect(formatHighLevelReviewBody([item({}), item({})])).toBe("");
	});

	it("lists each checklist comment under its title", () => {
		const body = formatHighLevelReviewBody([
			item({ title: "Structure", comment: "Nice split" }),
			item({ title: "Description" }),
			item({ title: "Tests", comment: "Good coverage" }),
		]);

		expect(body).toBe(
			"**Structure**\n\nNice split\n\n**Tests**\n\nGood coverage",
		);
	});

	it("lists each queued comment with its file:lines after the checklist comments", () => {
		const body = formatHighLevelReviewBody(
			[item({ title: "Tests", comment: "Mostly fine" })],
			[
				{
					path: "src/a.test.ts",
					startLine: 12,
					endLine: 12,
					quote: "handles empty input",
					note: "Assert the error too\nnot just the count",
				},
				{
					path: "src/b.ts",
					startLine: 3,
					endLine: 5,
					quote: "works",
					note: "Redundant",
				},
			],
		);

		expect(body).toBe(
			[
				"**Tests**",
				"",
				"Mostly fine",
				"",
				"**Comments**",
				"",
				"- `src/a.test.ts:12` handles empty input: Assert the error too",
				"  not just the count",
				"- `src/b.ts:3-5` works: Redundant",
			].join("\n"),
		);
	});
});
