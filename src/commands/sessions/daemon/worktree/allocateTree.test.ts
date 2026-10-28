import { beforeEach, describe, expect, it, vi } from "vitest";
import { daemonLog } from "../daemonLog";
import { allocateTree } from "./allocateTree";
import { createWorktree } from "./createWorktree";
import { worktreeConfigFor } from "./worktreeConfigFor";

vi.mock("../daemonLog", () => ({ daemonLog: vi.fn() }));
vi.mock("../../../../shared/findRepoRoot", () => ({
	findRepoRoot: (cwd: string) => (cwd.startsWith("/git/repo") ? cwd : null),
}));
vi.mock("./listWorktreePaths", () => ({ mainWorktree: () => "/git/repo" }));
vi.mock("./worktreeConfigFor", () => ({ worktreeConfigFor: vi.fn() }));
vi.mock("./createWorktree", () => ({
	createWorktree: vi.fn(() => "/git/repo-2"),
}));

const configMock = vi.mocked(worktreeConfigFor);
const createMock = vi.mocked(createWorktree);
const logMock = vi.mocked(daemonLog);

function configure(
	enabled: boolean,
	extra: { trunk?: boolean; root?: string } = {},
) {
	configMock.mockReturnValue({
		enabled,
		trunk: false,
		install: true,
		commitBeforeManualChecks: false,
		copy: [],
		...extra,
	});
}

const spilled = {
	cwd: "/git/repo-2",
	kind: "worktree",
	created: true,
	clone: "/git/repo",
};

describe("allocateTree", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		configure(true);
		createMock.mockReturnValue("/git/repo-2");
	});

	describe("with worktree.enabled on", () => {
		it("spills a session launched against an idle clone", () => {
			expect(allocateTree("/git/repo", new Set())).toEqual(spilled);
		});

		it("spills a session when a live session holds the clone", () => {
			expect(allocateTree("/git/repo", new Set(["/git/repo"]))).toEqual(
				spilled,
			);
		});

		it("spills from a subdirectory or sibling worktree into a new worktree of the clone", () => {
			expect(allocateTree("/git/repo-3/src", new Set())).toEqual(spilled);
		});

		it("logs that worktree.enabled forced the spill, naming the clone", () => {
			allocateTree("/git/repo", new Set());

			expect(logMock).toHaveBeenCalledWith(
				expect.stringMatching(
					/clone \/git\/repo into \/git\/repo-2: worktree\.enabled is on/,
				),
			);
		});

		it("passes the repo's branch strategy to the worktree it creates", () => {
			configure(true, { trunk: true, root: "~/git" });

			allocateTree("/git/repo", new Set(["/git/repo"]));

			expect(createMock).toHaveBeenCalledWith(
				"/git/repo",
				{ root: "~/git", trunk: true },
				new Set(["/git/repo"]),
				undefined,
			);
		});

		it("offers a reaped worktree's path back to the allocator so a resume can reclaim it", () => {
			createMock.mockReturnValue("/git/repo-7");

			expect(
				allocateTree("/git/repo", new Set(), { replacesTree: "/git/repo-7" })
					.cwd,
			).toBe("/git/repo-7");
			expect(createMock).toHaveBeenCalledWith(
				"/git/repo",
				{ root: undefined, trunk: false },
				new Set(),
				"/git/repo-7",
			);
		});
	});

	describe("for a session pinned to the tree it was launched from", () => {
		it("stays put even when another session already holds that tree", () => {
			expect(
				allocateTree("/git/repo", new Set(["/git/repo"]), { inPlace: true }),
			).toEqual({ cwd: "/git/repo", kind: "primary", created: false });
			expect(createMock).not.toHaveBeenCalled();
		});

		it("keeps a worktree cwd rather than normalising it to the clone", () => {
			expect(
				allocateTree("/git/repo-2", new Set(["/git/repo-2"]), {
					inPlace: true,
				}).cwd,
			).toBe("/git/repo-2");
		});
	});

	describe("with worktree.enabled off", () => {
		it("keeps the session in the requested tree", () => {
			configure(false);

			expect(allocateTree("/git/repo/src", new Set(["/git/repo"]))).toEqual({
				cwd: "/git/repo/src",
				kind: "primary",
				created: false,
			});
			expect(createMock).not.toHaveBeenCalled();
		});
	});

	it("leaves a session without a cwd unplaced", () => {
		expect(allocateTree(undefined, new Set())).toEqual({
			cwd: undefined,
			kind: "primary",
			created: false,
		});
	});
});
