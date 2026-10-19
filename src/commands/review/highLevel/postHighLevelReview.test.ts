import { beforeEach, describe, expect, it, vi } from "vitest";
import { postHighLevelReview } from "./postHighLevelReview";

const mockExecFileSync = vi.fn();

vi.mock("node:child_process", () => ({
	execFileSync: (...args: unknown[]) => mockExecFileSync(...args),
}));

const reviewArgs = ["pr", "review", "42", "--repo", "org/repo"];

beforeEach(() => {
	mockExecFileSync.mockReset();
});

describe("postHighLevelReview", () => {
	it("approves without a body when the body is empty", () => {
		postHighLevelReview("org/repo", 42, "APPROVE", "");

		expect(mockExecFileSync).toHaveBeenCalledWith(
			"gh",
			[...reviewArgs, "--approve"],
			expect.anything(),
		);
	});

	it.each([
		["APPROVE", "--approve"],
		["COMMENT", "--comment"],
		["REQUEST_CHANGES", "--request-changes"],
	] as const)("submits %s with %s and the body", (event, flag) => {
		postHighLevelReview("org/repo", 42, event, "**Tests**\n\nGood");

		expect(mockExecFileSync).toHaveBeenCalledWith(
			"gh",
			[...reviewArgs, flag, "--body", "**Tests**\n\nGood"],
			expect.anything(),
		);
	});

	it("rethrows gh stderr as the error message", () => {
		mockExecFileSync.mockImplementation(() => {
			throw Object.assign(new Error("failed"), {
				stderr: "Can not approve your own pull request\n",
			});
		});

		expect(() => postHighLevelReview("org/repo", 42, "APPROVE", "")).toThrow(
			"Can not approve your own pull request",
		);
	});
});
