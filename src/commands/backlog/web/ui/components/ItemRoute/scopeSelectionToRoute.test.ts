import { describe, expect, it } from "vitest";
import type { RepoSelection } from "../../../../../sessions/web/ui/useRepoSelectionContext";
import { scopeSelectionToRoute } from "./scopeSelectionToRoute";

const windowsWorktree = String.raw`C:\git\assist-2`;

const selection: RepoSelection = {
	repos: ["/home/me/git/assist"],
	selectedCwd: "/home/me/git/assist",
	worktreeCwd: "/home/me/git/assist",
	setSelectedCwd: () => {},
	cloneOn: (cwd, node) => (node ? undefined : cwd),
	originOf: () => undefined,
};

describe("scopeSelectionToRoute", () => {
	it("returns the selection unchanged without a cwd param", () => {
		expect(scopeSelectionToRoute(selection, undefined, "pc", "wsl")).toBe(
			selection,
		);
	});

	it("selects the route's cwd and node", () => {
		const scoped = scopeSelectionToRoute(
			selection,
			windowsWorktree,
			"pc",
			"wsl",
		);
		expect(scoped.selectedCwd).toBe(windowsWorktree);
		expect(scoped.selectedNode).toBe("pc");
	});

	it("never maps a linked node's cwd onto the local node", () => {
		const scoped = scopeSelectionToRoute(
			selection,
			windowsWorktree,
			"pc",
			"wsl",
		);
		expect(scoped.cloneOn(windowsWorktree, undefined)).toBeUndefined();
		expect(scoped.cloneOn(windowsWorktree, "wsl")).toBeUndefined();
	});

	it("keeps a local route cwd on the local node", () => {
		const scoped = scopeSelectionToRoute(selection, "/tmp/wt", "wsl", "wsl");
		expect(scoped.cloneOn("/tmp/wt", undefined)).toBe("/tmp/wt");
	});

	it("leaves lookups for other cwds alone", () => {
		const scoped = scopeSelectionToRoute(
			selection,
			windowsWorktree,
			"pc",
			"wsl",
		);
		expect(scoped.cloneOn("/home/me/git/assist", undefined)).toBe(
			"/home/me/git/assist",
		);
	});
});
