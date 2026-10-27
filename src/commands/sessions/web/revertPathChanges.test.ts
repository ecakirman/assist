import { beforeEach, describe, expect, it, vi } from "vitest";
import { execGit } from "./execGit";
import { revertPathChanges } from "./revertPathChanges";

vi.mock("./execGit", () => ({ execGit: vi.fn() }));

const execGitMock = vi.mocked(execGit);

type GitState = {
	inHead?: boolean;
	tracked?: boolean;
	statusBefore?: string;
	statusAfter?: string;
	nameStatus?: string;
};

function withGit(state: GitState): void {
	let reverted = false;
	execGitMock.mockImplementation(async (_cwd, [, command]) => {
		if (command === "status")
			return reverted
				? (state.statusAfter ?? "")
				: (state.statusBefore ?? " M x\0");
		if (command === "diff") return state.nameStatus ?? "";
		if (command === "ls-tree")
			return state.inHead ? "100644 blob abc\tx\n" : "";
		if (command === "ls-files") {
			if (!state.tracked) throw new Error("not tracked");
			return "";
		}
		reverted = true;
		return "";
	});
}

const gitCalls = (): string[][] =>
	execGitMock.mock.calls.map(([, args]) => args.slice(1));

describe("revertPathChanges", () => {
	beforeEach(() => vi.clearAllMocks());

	it("restores a file in HEAD", async () => {
		withGit({ inHead: true, tracked: true });

		await revertPathChanges("/repo", "src/app.ts");

		expect(gitCalls()).toContainEqual(["checkout", "HEAD", "--", "src/app.ts"]);
	});

	it("restores a staged deletion that is no longer in the index", async () => {
		withGit({ inHead: true, tracked: false });

		await revertPathChanges("/repo", "src/gone.ts");

		expect(gitCalls()).toContainEqual([
			"checkout",
			"HEAD",
			"--",
			"src/gone.ts",
		]);
		expect(gitCalls()).not.toContainEqual(["clean", "-f", "--", "src/gone.ts"]);
	});

	it("deletes an untracked file", async () => {
		withGit({});

		await revertPathChanges("/repo", "src/new.ts");

		expect(gitCalls()).toContainEqual(["clean", "-f", "--", "src/new.ts"]);
	});

	it("removes a staged addition that is not in HEAD", async () => {
		withGit({ tracked: true });

		await revertPathChanges("/repo", "src/staged.ts");

		expect(gitCalls()).toContainEqual(["rm", "-f", "--", "src/staged.ts"]);
	});

	it("restores the source of a rename", async () => {
		withGit({
			inHead: true,
			nameStatus: "M\0other.ts\0R100\0src/old.ts\0src/new.ts\0",
		});

		await revertPathChanges("/repo", "src/new.ts");

		expect(gitCalls()).toContainEqual(["checkout", "HEAD", "--", "src/old.ts"]);
		expect(gitCalls()).not.toContainEqual([
			"checkout",
			"HEAD",
			"--",
			"other.ts",
		]);
	});

	it("passes pathspecs literally", async () => {
		withGit({ inHead: true });

		await revertPathChanges("/repo", "[id].ts");

		for (const [, args] of execGitMock.mock.calls)
			expect(args[0]).toBe("--literal-pathspecs");
	});

	it("rejects a path with no uncommitted changes", async () => {
		withGit({ statusBefore: "" });

		await expect(revertPathChanges("/repo", "src/none.ts")).rejects.toThrow(
			"No uncommitted changes found for src/none.ts",
		);
		expect(gitCalls()).not.toContainEqual(["clean", "-f", "--", "src/none.ts"]);
	});

	it("rejects when changes remain after reverting", async () => {
		withGit({ inHead: true, statusAfter: " M src/app.ts\0" });

		await expect(revertPathChanges("/repo", "src/app.ts")).rejects.toThrow(
			"src/app.ts still has uncommitted changes",
		);
	});
});
