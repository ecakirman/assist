import { describe, expect, it } from "vitest";
import type { HighLevelStructure } from "../../../../../../../../review/highLevel/types";
import { highLevelJumpCounts } from "./highLevelJumpCounts";
import { parseHighLevelPreview } from "./parseHighLevelPreview";

function payload(fields: Record<string, unknown>) {
	return parseHighLevelPreview(JSON.stringify(fields));
}

const structure: Partial<HighLevelStructure> = {
	added: 2,
	removed: 1,
	modified: 9,
};

describe("highLevelJumpCounts", () => {
	it("counts changed files, critical diffs and changed tests", () => {
		const counts = highLevelJumpCounts(
			payload({
				structure,
				criticalDiffs: [{ path: "a.ts" }],
				tests: [
					{
						path: "a.test.ts",
						tests: [
							{ kind: "it", name: "one" },
							{
								kind: "describe",
								name: "group",
								children: [{ kind: "it", name: "two" }],
							},
						],
					},
				],
			}),
		);

		expect(counts).toEqual({
			"structure-sensible": "(12)",
			"critical-diffs-correct": "(1)",
			"tests-worth-having": "(2)",
		});
	});

	it("leaves out zero and unknown counts", () => {
		expect(highLevelJumpCounts(payload({}))).toEqual({});
		expect(highLevelJumpCounts(payload({ structure: { added: "x" } }))).toEqual(
			{},
		);
	});
});
