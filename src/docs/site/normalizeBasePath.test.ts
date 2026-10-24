import { describe, expect, it } from "vitest";
import { normalizeBasePath } from "./normalizeBasePath";

describe("normalizeBasePath", () => {
	it.each([
		["/", "/"],
		["", "/"],
		["assist", "/assist/"],
		["/assist", "/assist/"],
		["/projects/assist/", "/projects/assist/"],
	])("normalizes %j to %j", (input, expected) => {
		expect(normalizeBasePath(input)).toBe(expected);
	});
});
