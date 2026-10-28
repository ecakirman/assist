import { describe, expect, it } from "vitest";
import { carryOverComments } from "./carryOverComments";

const comment = (quote: string, start: number) => ({
	quote,
	note: `on ${quote}`,
	start,
	end: start + quote.length,
});

describe("carryOverComments", () => {
	it("keeps a comment whose quote is still present, re-anchored to its new offset", () => {
		const result = carryOverComments(
			[comment("second line", 10)],
			"A new intro. Then the second line follows.",
		);

		expect(result).toEqual([
			{ quote: "second line", note: "on second line", start: 22, end: 33 },
		]);
	});

	it("drops a comment whose quote no longer appears", () => {
		const result = carryOverComments(
			[comment("removed text", 0), comment("kept", 20)],
			"Only the kept words remain.",
		);

		expect(result.map((c) => c.quote)).toEqual(["kept"]);
	});

	it("anchors a repeated quote to the occurrence nearest its old offset", () => {
		const result = carryOverComments(
			[comment("same", 18)],
			"same here, and same there",
		);

		expect(result[0]?.start).toBe(15);
	});
});
