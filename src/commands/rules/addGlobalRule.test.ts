import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parse as parseYaml } from "yaml";
import { addGlobalRule } from "./addGlobalRule";

describe("addGlobalRule", () => {
	let dir: string;
	let globalConfigPath: string;

	beforeEach(() => {
		dir = mkdtempSync(join(tmpdir(), "add-global-rule-"));
		globalConfigPath = join(dir, ".assist.yml");
		vi.spyOn(console, "log").mockImplementation(() => {});
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		rmSync(dir, { recursive: true, force: true });
		process.exitCode = undefined;
		vi.restoreAllMocks();
	});

	function readGlobal(): Record<string, unknown> {
		return parseYaml(readFileSync(globalConfigPath, "utf8"));
	}

	it("appends to advice.rules after the existing entries", () => {
		writeFileSync(
			globalConfigPath,
			"advice:\n  extra: Be brief\n  rules:\n    - title: First\n      text: Existing rule\n",
		);

		addGlobalRule(
			"Give the direct URL",
			{ title: "Link, don't navigate" },
			globalConfigPath,
		);

		expect(readGlobal()).toEqual({
			advice: {
				extra: "Be brief",
				rules: [
					{ title: "First", text: "Existing rule" },
					{ title: "Link, don't navigate", text: "Give the direct URL" },
				],
			},
		});
	});

	it("creates advice.rules when the global config has none", () => {
		addGlobalRule("Give the direct URL", { title: "Links" }, globalConfigPath);

		expect(readGlobal()).toEqual({
			advice: { rules: [{ title: "Links", text: "Give the direct URL" }] },
		});
	});

	it("rejects --scope", () => {
		addGlobalRule(
			"Give the direct URL",
			{ title: "Links", scope: "." },
			globalConfigPath,
		);

		expect(process.exitCode).toBe(1);
		expect(() => readFileSync(globalConfigPath)).toThrow();
	});

	it("requires a title", () => {
		addGlobalRule("Give the direct URL", {}, globalConfigPath);

		expect(process.exitCode).toBe(1);
		expect(() => readFileSync(globalConfigPath)).toThrow();
	});
});
