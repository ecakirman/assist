import { describe, expect, it } from "vitest";
import { formatHighLevelApprovalBody } from "./formatHighLevelApprovalBody";
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

describe("formatHighLevelApprovalBody", () => {
	it("is empty when no comments were left", () => {
		expect(formatHighLevelApprovalBody([item({}), item({})])).toBe("");
	});

	it("lists each checklist comment under its title", () => {
		const body = formatHighLevelApprovalBody([
			item({ title: "Structure", comment: "Nice split" }),
			item({ title: "Description" }),
			item({ title: "Tests", comment: "Good coverage" }),
		]);

		expect(body).toBe(
			"**Structure**\n\nNice split\n\n**Tests**\n\nGood coverage",
		);
	});

	it("lists each test comment with its file:line and test title", () => {
		const body = formatHighLevelApprovalBody([
			item({
				title: "Tests are meaningful",
				testComments: [
					{
						id: "t1",
						path: "src/a.test.ts",
						line: 12,
						title: ["parses", "handles empty input"],
						comment: "Assert the error too\nnot just the count",
					},
					{
						id: "t2",
						path: "src/b.test.ts",
						line: 3,
						title: ["works"],
						comment: "Redundant",
					},
				],
			}),
		]);

		expect(body).toBe(
			[
				"**Tests are meaningful**",
				"",
				"- `src/a.test.ts:12` parses › handles empty input: Assert the error too",
				"  not just the count",
				"- `src/b.test.ts:3` works: Redundant",
			].join("\n"),
		);
	});

	it("puts the checklist comment before its test comments", () => {
		const body = formatHighLevelApprovalBody([
			item({
				title: "Tests",
				comment: "Mostly fine",
				testComments: [
					{
						id: "t1",
						path: "src/a.test.ts",
						line: 1,
						title: ["x"],
						comment: "Rename",
					},
				],
			}),
		]);

		expect(body).toBe(
			"**Tests**\n\nMostly fine\n\n- `src/a.test.ts:1` x: Rename",
		);
	});
});
