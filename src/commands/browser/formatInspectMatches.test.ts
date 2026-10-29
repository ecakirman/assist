import { describe, expect, it } from "vitest";
import { formatInspectMatches } from "./formatInspectMatches";

const match = {
	chain: ["html", "body", "button#go.primary"],
	text: "Publish",
	width: 96,
	height: 32,
};

describe("formatInspectMatches", () => {
	it("prints each match's size, text and one ancestor per line", () => {
		expect(formatInspectMatches({ matches: [match], total: 1 }, "q")).toEqual([
			'[1/1] 96×32 "Publish"',
			"  html",
			"  body",
			"  button#go.primary",
		]);
	});

	it("says when nothing matches", () => {
		expect(
			formatInspectMatches({ matches: [], total: 0 }, 'text "Approve"'),
		).toEqual(['no elements match text "Approve"']);
	});

	it("says how many matches were left out by the cap", () => {
		const lines = formatInspectMatches({ matches: [match], total: 30 }, "q");
		expect(lines[0]).toBe('[1/30] 96×32 "Publish"');
		expect(lines.at(-1)).toBe(
			"showing the first 1 of 30 matches; narrow the query to see the rest",
		);
	});
});
