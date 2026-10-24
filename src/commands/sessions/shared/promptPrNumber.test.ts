import { describe, expect, it } from "vitest";
import { promptPrNumber } from "./promptPrNumber";

describe("promptPrNumber", () => {
	it("reads the PR a prompt led by its GitHub URL names", () => {
		expect(
			promptPrNumber("https://github.com/o/r/pull/12\n\nwhy did CI fail?"),
		).toBe(12);
		expect(promptPrNumber("https://github.com/o/r/pull/12")).toBe(12);
		expect(promptPrNumber("https://github.com/o/r/pull/12/files")).toBe(12);
		expect(promptPrNumber("https://github.com/o/r/pull/12#discussion_r1")).toBe(
			12,
		);
	});

	it("ignores prompts led by other GitHub URLs", () => {
		expect(promptPrNumber("https://github.com/o/r")).toBeUndefined();
		expect(promptPrNumber("https://github.com/o/r/issues/12")).toBeUndefined();
		expect(promptPrNumber("https://github.com/o/r/pulls")).toBeUndefined();
		expect(promptPrNumber("https://github.com/o/r/pull/12abc")).toBeUndefined();
		expect(
			promptPrNumber("see https://github.com/o/r/pull/12"),
		).toBeUndefined();
	});

	it("ignores other prompts", () => {
		expect(promptPrNumber(undefined)).toBeUndefined();
		expect(promptPrNumber("review #12")).toBeUndefined();
	});
});
