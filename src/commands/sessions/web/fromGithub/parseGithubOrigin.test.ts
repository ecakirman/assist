import { describe, expect, it } from "vitest";
import { parseGithubOrigin } from "./parseGithubOrigin";

describe("parseGithubOrigin", () => {
	it("reads owner/repo from a review comment permalink", () => {
		expect(
			parseGithubOrigin(
				"https://github.com/staff0rd/assist/pull/2019#discussion_r4264996471",
			),
		).toBe("github.com/staff0rd/assist");
	});

	it("reads owner/repo from an issue URL", () => {
		expect(parseGithubOrigin("https://github.com/org/repo/issues/7")).toBe(
			"github.com/org/repo",
		);
	});

	it("strips a trailing .git", () => {
		expect(parseGithubOrigin("https://github.com/org/repo.git")).toBe(
			"github.com/org/repo",
		);
	});

	it("rejects other hosts", () => {
		expect(parseGithubOrigin("https://gitlab.com/org/repo/pull/1")).toBe(null);
	});

	it("rejects URLs without a repo", () => {
		expect(parseGithubOrigin("https://github.com/org")).toBe(null);
	});

	it("rejects text that is not a URL", () => {
		expect(parseGithubOrigin("not a url")).toBe(null);
	});
});
