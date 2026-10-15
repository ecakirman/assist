import { describe, expect, it } from "vitest";
import { githubPullNumber } from "./githubPullNumber";

describe("githubPullNumber", () => {
	it("reads the number from a PR URL or subpage", () => {
		expect(githubPullNumber("https://github.com/org/repo/pull/12")).toBe("12");
		expect(githubPullNumber("https://github.com/org/repo/pull/12/files")).toBe(
			"12",
		);
	});

	it("ignores issues, PR lists and non-URLs", () => {
		expect(githubPullNumber("https://github.com/org/repo/issues/7")).toBe(
			undefined,
		);
		expect(githubPullNumber("https://github.com/org/repo/pulls")).toBe(
			undefined,
		);
		expect(githubPullNumber("not a url")).toBe(undefined);
	});
});
