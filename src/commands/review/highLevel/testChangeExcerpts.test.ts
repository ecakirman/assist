import { describe, expect, it } from "vitest";
import { testChangeExcerpts } from "./testChangeExcerpts";

const source = Array.from({ length: 30 }, (_, i) => `l${i + 5}`).join("\n");

describe("testChangeExcerpts", () => {
	it("frames each change with three lines of context, clipped to the test", () => {
		expect(testChangeExcerpts(source, 5, [6, 33])).toEqual([
			{ line: 5, source: "l5\nl6\nl7\nl8\nl9" },
			{ line: 30, source: "l30\nl31\nl32\nl33\nl34" },
		]);
	});

	it("merges changes whose context overlaps or touches", () => {
		expect(testChangeExcerpts(source, 5, [20, 13])).toEqual([
			{
				line: 10,
				source:
					"l10\nl11\nl12\nl13\nl14\nl15\nl16\nl17\nl18\nl19\nl20\nl21\nl22\nl23",
			},
		]);
	});
});
