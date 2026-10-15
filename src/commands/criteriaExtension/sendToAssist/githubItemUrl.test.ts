import { describe, expect, it } from "vitest";
import { githubItemUrl } from "./githubItemUrl";

const origin = "https://github.com";

describe("githubItemUrl", () => {
	it("trims a pull request subpage to the pull request", () => {
		expect(githubItemUrl({ origin, pathname: "/org/repo/pull/12/files" })).toBe(
			"https://github.com/org/repo/pull/12",
		);
	});

	it("keeps an issue URL", () => {
		expect(githubItemUrl({ origin, pathname: "/org/repo/issues/7" })).toBe(
			"https://github.com/org/repo/issues/7",
		);
	});

	it("ignores pages that are not an issue or pull request", () => {
		expect(githubItemUrl({ origin, pathname: "/org/repo/issues/new" })).toBe(
			undefined,
		);
		expect(githubItemUrl({ origin, pathname: "/org/repo/pulls" })).toBe(
			undefined,
		);
	});
});
