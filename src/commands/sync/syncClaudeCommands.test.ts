import {
	existsSync,
	lstatSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { syncClaudeCommands } from "./syncClaudeCommands";

const PR = "---\ndescription: Raise a PR\n---\n\nPR BODY\n";
const COMMIT = "---\ndescription: Commit\n---\n\nCOMMIT BODY\n";

describe("syncClaudeCommands", () => {
	let claudeDir: string;
	let targetBase: string;

	beforeEach(() => {
		vi.spyOn(console, "log").mockImplementation(() => {});
		claudeDir = mkdtempSync(join(tmpdir(), "assist-cmd-source-"));
		targetBase = mkdtempSync(join(tmpdir(), "assist-cmd-target-"));
		mkdirSync(join(claudeDir, "commands"));
		writeFileSync(join(claudeDir, "commands", "pr.md"), PR);
		writeFileSync(join(claudeDir, "commands", "commit.md"), COMMIT);
	});

	afterEach(() => {
		rmSync(claudeDir, { recursive: true, force: true });
		rmSync(targetBase, { recursive: true, force: true });
		vi.restoreAllMocks();
	});

	const skillFile = (name: string) =>
		join(targetBase, "skills", name, "SKILL.md");

	it("writes every command as a personal skill", () => {
		syncClaudeCommands(claudeDir, targetBase);

		expect(readFileSync(skillFile("pr"), "utf8")).toBe(
			'---\nname: pr\ndescription: "Raise a PR"\n---\n\nPR BODY\n',
		);
		expect(readFileSync(skillFile("commit"), "utf8")).toBe(
			'---\nname: commit\ndescription: "Commit"\n---\n\nCOMMIT BODY\n',
		);
	});

	it("returns the synced command names, ignoring non-.md files", () => {
		writeFileSync(join(claudeDir, "commands", "notes.txt"), "x");

		expect(syncClaudeCommands(claudeDir, targetBase).sort()).toEqual([
			"commit",
			"pr",
		]);
	});

	it("removes a previously synced command file", () => {
		mkdirSync(join(targetBase, "commands"));
		writeFileSync(join(targetBase, "commands", "pr.md"), "OLD");
		writeFileSync(join(targetBase, "commands", "mine.md"), "MINE");

		syncClaudeCommands(claudeDir, targetBase);

		expect(existsSync(join(targetBase, "commands", "pr.md"))).toBe(false);
		expect(existsSync(join(targetBase, "commands", "mine.md"))).toBe(true);
	});

	it("replaces a symlinked SKILL.md without touching its target", () => {
		const linkTarget = join(targetBase, "elsewhere.md");
		writeFileSync(linkTarget, "ORIGINAL");
		mkdirSync(join(targetBase, "skills", "pr"), { recursive: true });
		symlinkSync(linkTarget, skillFile("pr"));

		syncClaudeCommands(claudeDir, targetBase);

		expect(lstatSync(skillFile("pr")).isSymbolicLink()).toBe(false);
		expect(readFileSync(skillFile("pr"), "utf8")).toContain("name: pr");
		expect(readFileSync(linkTarget, "utf8")).toBe("ORIGINAL");
	});
});
