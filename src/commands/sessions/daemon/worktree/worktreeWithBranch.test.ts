import { describe, expect, it } from "vitest";
import { worktreeWithBranch } from "./worktreeWithBranch";

const listing = [
	"worktree /git/app",
	"HEAD abc",
	"branch refs/heads/main",
	"",
	"worktree /git/app-5",
	"HEAD def",
	"branch refs/heads/feature/login",
	"",
	"worktree /git/app-6",
	"HEAD 123",
	"detached",
].join("\n");

describe("worktreeWithBranch", () => {
	it("finds the worktree that has the branch checked out", () => {
		expect(worktreeWithBranch(listing, "feature/login")).toBe("/git/app-5");
		expect(worktreeWithBranch(listing, "main")).toBe("/git/app");
	});

	it("returns null when no worktree has the branch", () => {
		expect(worktreeWithBranch(listing, "feature")).toBeNull();
	});
});
