import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveRepoLocation } from "../../../backlog/resolveRepoLocation";
import { planGithubReview } from "./planGithubReview";

vi.mock("../../../backlog/resolveRepoLocation", () => ({
	resolveRepoLocation: vi.fn(),
}));

const mockResolve = vi.mocked(resolveRepoLocation);
const URL = "https://github.com/org/repo/pull/12";

afterEach(() => vi.clearAllMocks());

describe("planGithubReview", () => {
	it("appends the PR number to a review mode's args", () => {
		mockResolve.mockReturnValue({ cwd: "/base/repo" });
		expect(
			planGithubReview({ url: URL, args: ["review", "--refine"] }, "/base"),
		).toEqual({
			ok: true,
			cwd: "/base/repo",
			assistArgs: ["review", "--refine", "12"],
		});
	});

	it.each([
		[["backlog", "run", "a1"]],
		[["review", "--refine", "--apply"]],
		[["review", "12"]],
		["review"],
		[undefined],
	])("rejects args that are not a review mode: %j", (args) => {
		expect(planGithubReview({ url: URL, args }, "/base")).toEqual({
			ok: false,
			status: 400,
			error: "Unsupported assist args",
		});
		expect(mockResolve).not.toHaveBeenCalled();
	});

	it("rejects a URL that is not a PR", () => {
		expect(
			planGithubReview(
				{ url: "https://github.com/org/repo/issues/7", args: ["review"] },
				"/base",
			),
		).toMatchObject({ ok: false, status: 400 });
	});

	it("reports 404 when the repo is not cloned", () => {
		mockResolve.mockReturnValue({ cloneTarget: "/base/repo" });
		expect(planGithubReview({ url: URL, args: ["review"] }, "/base")).toEqual({
			ok: false,
			status: 404,
			error: "org/repo is not cloned under /base",
		});
	});
});
