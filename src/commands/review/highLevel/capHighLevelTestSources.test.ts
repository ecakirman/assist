import { describe, expect, it } from "vitest";
import { capHighLevelTestSources } from "./capHighLevelTestSources";
import type { HighLevelTestCase, HighLevelTestFile } from "./types";

function test(line: number, lines: number): HighLevelTestCase {
	return {
		kind: "it",
		id: `a.test.ts:${line}`,
		name: `t${line}`,
		line,
		source: Array(lines).fill("x").join("\n"),
	};
}

function file(tests: HighLevelTestCase[]): HighLevelTestFile {
	return {
		path: "a.test.ts",
		status: "added",
		additions: 1,
		deletions: 0,
		diffUrl: "u",
		tests,
	};
}

describe("capHighLevelTestSources", () => {
	it("keeps sources inside the budget untouched", () => {
		const files = [file([test(1, 10)])];

		expect(capHighLevelTestSources(files)).toEqual(files);
	});

	it("drops a source past the per-test cap and marks it truncated", () => {
		const [capped] = capHighLevelTestSources([file([test(1, 500)])]);

		expect(capped?.tests[0]).toEqual({
			kind: "it",
			id: "a.test.ts:1",
			name: "t1",
			line: 1,
			truncated: true,
		});
	});

	it("shows the changed lines and their context of a long test with a small change", () => {
		const source = Array.from({ length: 2400 }, (_, i) => `l${i + 10}`).join(
			"\n",
		);
		const changedLines = Array.from({ length: 12 }, (_, i) => 1000 + i);
		const [capped] = capHighLevelTestSources([
			file([{ ...test(10, 1), source, change: "modified", changedLines }]),
		]);
		const lines = (from: number, to: number) =>
			Array.from({ length: to - from + 1 }, (_, i) => `l${from + i}`).join(
				"\n",
			);

		expect(capped?.tests[0]).toEqual({
			kind: "it",
			id: "a.test.ts:10",
			name: "t10",
			line: 10,
			change: "modified",
			excerpts: [{ line: 997, source: lines(997, 1014) }],
		});
	});

	it("marks a long test truncated when its change is itself over the cap", () => {
		const changedLines = Array.from({ length: 300 }, (_, i) => 100 + i);
		const [capped] = capHighLevelTestSources([
			file([{ ...test(1, 500), change: "modified", changedLines }]),
		]);

		expect(capped?.tests[0]).toEqual({
			kind: "it",
			id: "a.test.ts:1",
			name: "t1",
			line: 1,
			change: "modified",
			truncated: true,
		});
	});

	it("drops changed lines from a test shown in full", () => {
		const [capped] = capHighLevelTestSources([
			file([{ ...test(1, 10), change: "modified", changedLines: [3] }]),
		]);

		expect(capped?.tests[0]).toEqual({ ...test(1, 10), change: "modified" });
	});

	it("stops shipping sources once the review-wide budget is spent", () => {
		const tests = Array.from({ length: 30 }, (_, i) => test(i, 200));
		const [capped] = capHighLevelTestSources([file(tests)]);
		const shipped = capped?.tests.filter(
			(node) => node.kind === "it" && node.source !== undefined,
		);

		expect(shipped).toHaveLength(25);
	});

	it("ships a short test that comes after the budget-consuming tests", () => {
		const tests = [
			...Array.from({ length: 30 }, (_, i) => test(i, 200)),
			test(100, 12),
		];
		const [capped] = capHighLevelTestSources([file(tests)]);

		expect(capped?.tests.at(-1)).toEqual(test(100, 12));
	});

	it("marks a test left out by the budget as over budget, not truncated", () => {
		const tests = Array.from({ length: 30 }, (_, i) => test(i, 200));
		const [capped] = capHighLevelTestSources([file(tests)]);

		expect(capped?.tests.at(-1)).toEqual({
			kind: "it",
			id: "a.test.ts:29",
			name: "t29",
			line: 29,
			overBudget: true,
		});
	});
});
