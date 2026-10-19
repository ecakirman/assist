import { describe, expect, it } from "vitest";
import { splitOnTerm } from "./splitOnTerm";

const matches = (text: string, term: string) =>
	splitOnTerm(text, term)
		.filter((s) => s.match)
		.map((s) => s.text);

describe("splitOnTerm", () => {
	it("marks every match and keeps the text between them", () => {
		expect(splitOnTerm("a needle and a needle", "needle")).toEqual([
			{ text: "a ", start: 0, match: false },
			{ text: "needle", start: 2, match: true },
			{ text: " and a ", start: 8, match: false },
			{ text: "needle", start: 15, match: true },
		]);
	});

	it("matches case-insensitively and keeps the original casing", () => {
		expect(matches("Needle NEEDLE needle", "nEEdle")).toEqual([
			"Needle",
			"NEEDLE",
			"needle",
		]);
	});

	it("leaves the text whole when there is no term", () => {
		expect(splitOnTerm("a needle", "")).toEqual([
			{ text: "a needle", start: 0, match: false },
		]);
	});

	it("leaves the text whole when nothing matches", () => {
		expect(matches("a haystack", "needle")).toEqual([]);
	});
});
