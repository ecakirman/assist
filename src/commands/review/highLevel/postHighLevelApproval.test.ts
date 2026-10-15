import { beforeEach, describe, expect, it, vi } from "vitest";
import { postHighLevelApproval } from "./postHighLevelApproval";

const mockExecFileSync = vi.fn();

vi.mock("node:child_process", () => ({
	execFileSync: (...args: unknown[]) => mockExecFileSync(...args),
}));

const approveArgs = ["pr", "review", "42", "--repo", "org/repo", "--approve"];

beforeEach(() => {
	mockExecFileSync.mockReset();
});

describe("postHighLevelApproval", () => {
	it("approves without a body when the body is empty", () => {
		postHighLevelApproval("org/repo", 42, "");

		expect(mockExecFileSync).toHaveBeenCalledWith(
			"gh",
			approveArgs,
			expect.anything(),
		);
	});

	it("passes a non-empty body to the approval", () => {
		postHighLevelApproval("org/repo", 42, "**Tests**\n\nGood");

		expect(mockExecFileSync).toHaveBeenCalledWith(
			"gh",
			[...approveArgs, "--body", "**Tests**\n\nGood"],
			expect.anything(),
		);
	});

	it("rethrows gh stderr as the error message", () => {
		mockExecFileSync.mockImplementation(() => {
			throw Object.assign(new Error("failed"), {
				stderr: "Can not approve your own pull request\n",
			});
		});

		expect(() => postHighLevelApproval("org/repo", 42, "")).toThrow(
			"Can not approve your own pull request",
		);
	});
});
