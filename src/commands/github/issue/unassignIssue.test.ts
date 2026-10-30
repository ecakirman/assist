import { execFileSync as execFileSyncFn } from "node:child_process";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type * as childProcessMockModule from "../../../test/mocks/childProcessMock";

const execFileSync = vi.mocked(execFileSyncFn);

vi.mock("node:child_process", async () =>
	(
		await vi.importActual<typeof childProcessMockModule>(
			"../../../test/mocks/childProcessMock",
		)
	).childProcessMock(),
);
vi.mock("../../prs/shared", () => ({
	getRepoInfo: () => ({ org: "acme", repo: "widgets" }),
}));

import { unassignIssue } from "./unassignIssue";

let logged: string[] = [];
let errors: string[] = [];

beforeEach(() => {
	execFileSync.mockReset();
	execFileSync.mockReturnValue("");
	logged = [];
	errors = [];
	vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
		logged.push(args.join(" "));
	});
	vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
		errors.push(args.join(" "));
	});
	vi.spyOn(process, "exit").mockImplementation((() => {
		throw new Error("process.exit");
	}) as never);
});

describe("unassignIssue", () => {
	it("removes the authenticated user from the issue in the current repo", () => {
		unassignIssue("7", {});

		expect(execFileSync).toHaveBeenCalledWith(
			"gh",
			[
				"issue",
				"edit",
				"7",
				"--repo",
				"acme/widgets",
				"--remove-assignee",
				"@me",
			],
			expect.anything(),
		);
		expect(logged.join("\n")).toContain("Removed @me from acme/widgets#7");
	});

	it("targets the repo passed with -R", () => {
		unassignIssue("7", { repo: "other/thing" });

		expect(execFileSync).toHaveBeenCalledWith(
			"gh",
			expect.arrayContaining(["--repo", "other/thing"]),
			expect.anything(),
		);
		expect(logged.join("\n")).toContain("other/thing#7");
	});

	it("removes a named --assignee instead of @me", () => {
		unassignIssue("7", { assignee: ["alice"] });

		expect(execFileSync).toHaveBeenCalledWith(
			"gh",
			[
				"issue",
				"edit",
				"7",
				"--repo",
				"acme/widgets",
				"--remove-assignee",
				"alice",
			],
			expect.anything(),
		);
		expect(logged.join("\n")).toContain("Removed alice from acme/widgets#7");
	});

	it("removes each of several --assignee values", () => {
		unassignIssue("7", { assignee: ["alice", "bob"] });

		expect(execFileSync).toHaveBeenCalledWith(
			"gh",
			[
				"issue",
				"edit",
				"7",
				"--repo",
				"acme/widgets",
				"--remove-assignee",
				"alice",
				"--remove-assignee",
				"bob",
			],
			expect.anything(),
		);
		expect(logged.join("\n")).toContain(
			"Removed alice, bob from acme/widgets#7",
		);
	});

	it("prints usage and exits 1 for an invalid number", () => {
		expect(() => unassignIssue("nonsense", {})).toThrow("process.exit");
		expect(process.exit).toHaveBeenCalledWith(1);
		expect(errors.join("\n")).toContain("Usage: assist github issue unassign");
		expect(execFileSync).not.toHaveBeenCalled();
	});

	it("prints the gh error and exits 1 when gh fails", () => {
		execFileSync.mockImplementation(() => {
			throw new Error("HTTP 404");
		});

		expect(() => unassignIssue("7", {})).toThrow("process.exit");
		expect(process.exit).toHaveBeenCalledWith(1);
		expect(errors.join("\n")).toContain(
			"Could not unassign @me from acme/widgets#7",
		);
		expect(logged).toEqual([]);
	});
});
