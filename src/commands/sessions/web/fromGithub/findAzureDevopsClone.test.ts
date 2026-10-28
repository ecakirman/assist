import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { remoteUrl } from "../../../backlog/remoteUrl";
import { findAzureDevopsClone } from "./findAzureDevopsClone";

vi.mock("../../../backlog/remoteUrl", () => ({ remoteUrl: vi.fn() }));

const repo = { org: "acme", project: "proj", repo: "site" };
let base: string;

function clone(name: string, url: string): void {
	mkdirSync(join(base, name, ".git"), { recursive: true });
	remotes[join(base, name)] = url;
}

let remotes: Record<string, string>;

beforeEach(() => {
	base = mkdtempSync(join(tmpdir(), "ado-clone-"));
	remotes = {};
	vi.mocked(remoteUrl).mockImplementation((dir) => ({
		url: remotes[dir] ?? null,
		ok: true,
	}));
});

afterEach(() => rmSync(base, { recursive: true, force: true }));

describe("findAzureDevopsClone", () => {
	it("finds a clone named after the repo", () => {
		clone("site", "https://acme@dev.azure.com/acme/proj/_git/site");
		expect(findAzureDevopsClone(repo, base)).toBe(join(base, "site"));
	});

	it("finds a renamed clone through an ssh remote", () => {
		clone("site", "git@github.com:other/site.git");
		clone("renamed", "git@ssh.dev.azure.com:v3/acme/proj/site");
		expect(findAzureDevopsClone(repo, base)).toBe(join(base, "renamed"));
	});

	it("matches a visualstudio.com remote", () => {
		clone("web", "https://acme.visualstudio.com/proj/_git/site");
		expect(findAzureDevopsClone(repo, base)).toBe(join(base, "web"));
	});

	it("returns undefined when nothing matches", () => {
		clone("site", "https://dev.azure.com/acme/other/_git/site");
		expect(findAzureDevopsClone(repo, base)).toBeUndefined();
		expect(findAzureDevopsClone(repo, join(base, "missing"))).toBeUndefined();
	});
});
