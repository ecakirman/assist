import { existsSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type * as fsMockModule from "../../../../test/mocks/fsMock";
import { daemonLog } from "../daemonLog";
import { createWorktree } from "./createWorktree";
import { git, gitOrNull, gitResult } from "./git";

vi.mock("node:fs", async () =>
	(
		await vi.importActual<typeof fsMockModule>("../../../../test/mocks/fsMock")
	).fsMock(),
);
vi.mock("../daemonLog", () => ({ daemonLog: vi.fn() }));
vi.mock("./git", () => ({
	git: vi.fn(async () => ""),
	gitOrNull: vi.fn(),
	gitResult: vi.fn(async () => ({ ok: true, out: "" })),
}));
vi.mock("./listWorktreePaths", () => ({
	listWorktreePaths: () => ["/git/repo"],
	listLocalBranches: () => ["main"],
}));
vi.mock("./readWorktreeRegistry", () => ({ recordWorktree: vi.fn() }));
vi.mock("../../../backlog/getCachedOrigin", () => ({
	getCachedOrigin: () => "github.com/acme/repo",
}));

const gitMock = vi.mocked(git);
const gitOrNullMock = vi.mocked(gitOrNull);
const gitResultMock = vi.mocked(gitResult);

function gitState({ head = "main", verify = true } = {}) {
	gitOrNullMock.mockImplementation(async (_cwd: string, args: string[]) => {
		if (args[0] === "rev-parse") return verify ? "abc1234" : null;
		if (args[2] === "refs/remotes/origin/HEAD") return "origin/main";
		return head;
	});
}

function worktreeAdd(): string[] | undefined {
	return gitMock.mock.calls
		.map((call) => call[1])
		.find((args) => args[0] === "worktree");
}

async function create(
	strategy: { root: string | undefined; trunk: boolean },
	bound = new Set<string>(),
	preferred?: string,
): Promise<string> {
	const { path, ready } = createWorktree(
		"/git/repo",
		strategy,
		bound,
		preferred,
	);
	await ready;
	return path;
}

describe("createWorktree", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(existsSync).mockReturnValue(false);
		gitState();
	});

	describe("with trunk-based off (the default)", () => {
		it("starts the worktree branch off the remote default with no tracking", async () => {
			expect(await create({ root: undefined, trunk: false })).toBe(
				"/git/repo-2",
			);

			expect(worktreeAdd()).toEqual([
				"worktree",
				"add",
				"--no-track",
				"-b",
				"repo-2",
				"/git/repo-2",
				"origin/main",
			]);
		});
	});

	describe("with trunk-based on", () => {
		it("tracks the mainline so commits land there", async () => {
			await create({ root: undefined, trunk: true });

			expect(worktreeAdd()).toEqual([
				"worktree",
				"add",
				"--track",
				"-b",
				"repo-2",
				"/git/repo-2",
				"origin/main",
			]);
		});
	});

	it("never mutates the clone's shared push configuration", async () => {
		await create({ root: undefined, trunk: true });

		expect(gitMock.mock.calls.map((call) => call[1][0])).not.toContain(
			"config",
		);
	});

	describe("with a preferred path", () => {
		it("reclaims it when nothing holds it", async () => {
			expect(
				await create(
					{ root: undefined, trunk: false },
					new Set(),
					"/git/repo-7",
				),
			).toBe("/git/repo-7");

			expect(worktreeAdd()).toEqual([
				"worktree",
				"add",
				"--no-track",
				"-b",
				"repo-7",
				"/git/repo-7",
				"origin/main",
			]);
		});

		it("falls back to the next free suffix when it is already held", async () => {
			expect(
				await create(
					{ root: undefined, trunk: false },
					new Set(["/git/repo-7"]),
					"/git/repo-7",
				),
			).toBe("/git/repo-2");
		});
	});

	it("falls back to the clone's HEAD when the remote branch is unknown", async () => {
		gitState({ verify: false });

		await create({ root: undefined, trunk: true });

		expect(worktreeAdd()).toEqual([
			"worktree",
			"add",
			"--no-track",
			"-b",
			"repo-2",
			"/git/repo-2",
			"HEAD",
		]);
	});

	it("returns the reserved path before any network fetch completes", () => {
		gitResultMock.mockReturnValueOnce(new Promise(() => {}));

		const { path } = createWorktree(
			"/git/repo",
			{ root: undefined, trunk: false },
			new Set(),
		);

		expect(path).toBe("/git/repo-2");
		expect(worktreeAdd()).toBeUndefined();
	});

	it("fetches before resolving the start point", async () => {
		await create({ root: undefined, trunk: false });

		expect(gitResultMock).toHaveBeenCalledWith(
			"/git/repo",
			["fetch", "--quiet"],
			expect.any(Number),
		);
		const fetchOrder = gitResultMock.mock.invocationCallOrder[0];
		const verifyOrder = gitOrNullMock.mock.invocationCallOrder[0];
		expect(fetchOrder).toBeLessThan(verifyOrder ?? Infinity);
	});

	it("logs a failed fetch and still creates the worktree off local refs", async () => {
		gitResultMock.mockResolvedValueOnce({
			ok: false,
			error: "could not resolve host",
		});

		expect(await create({ root: undefined, trunk: false })).toBe("/git/repo-2");
		expect(daemonLog).toHaveBeenCalledWith(
			expect.stringContaining("could not resolve host"),
		);
		expect(worktreeAdd()).toBeDefined();
	});

	it("rejects ready when the worktree cannot be added", async () => {
		gitMock.mockRejectedValueOnce(new Error("branch exists"));

		const { ready } = createWorktree(
			"/git/repo",
			{ root: undefined, trunk: false },
			new Set(),
		);

		await expect(ready).rejects.toThrow("branch exists");
	});
});
