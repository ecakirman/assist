import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockLoadConfig = vi.fn();
let baseDir = "";

vi.mock("../../../shared/loadConfig", () => ({
	loadConfig: () => mockLoadConfig(),
}));

vi.mock("../../../shared/runConfigBaseDir", () => ({
	runConfigBaseDir: () => baseDir,
}));

import { resolveEntries } from "./resolveEntries";

function writePackageJson(dir: string, scripts: Record<string, string>): void {
	fs.mkdirSync(path.join(baseDir, dir), { recursive: true });
	fs.writeFileSync(
		path.join(baseDir, dir, "package.json"),
		JSON.stringify({ scripts }),
	);
}

describe("resolveEntries with verify.roots", () => {
	beforeEach(() => {
		baseDir = fs.mkdtempSync(path.join(os.tmpdir(), "verify-roots-"));
		writePackageJson(".", { "verify:format": "biome", build: "tsc" });
		writePackageJson("coach-tools", {
			"verify:lint": "eslint",
			"verify:types": "tsc",
		});
		writePackageJson("member-app", { "verify:lint": "eslint" });
	});

	afterEach(() => {
		fs.rmSync(baseDir, { recursive: true, force: true });
	});

	it("names root scripts by root, runs them in the root and filters to it", () => {
		mockLoadConfig.mockReturnValue({
			verify: { roots: ["coach-tools", "./member-app/"] },
		});

		const entries = resolveEntries();

		expect(entries).toEqual([
			{
				name: "coach-tools:verify:lint",
				fullCommand: "npm run verify:lint",
				cwd: path.join(baseDir, "coach-tools"),
				filter: "coach-tools/**",
			},
			{
				name: "coach-tools:verify:types",
				fullCommand: "npm run verify:types",
				cwd: path.join(baseDir, "coach-tools"),
				filter: "coach-tools/**",
			},
			{
				name: "member-app:verify:lint",
				fullCommand: "npm run verify:lint",
				cwd: path.join(baseDir, "member-app"),
				filter: "member-app/**",
			},
			{
				name: "verify:format",
				fullCommand: "npm run verify:format",
				cwd: baseDir,
				outsideRoots: ["coach-tools", "member-app"],
			},
		]);
	});

	it("skips roots without a package.json", () => {
		mockLoadConfig.mockReturnValue({ verify: { roots: ["missing"] } });

		expect(resolveEntries().map((e) => e.name)).toEqual(["verify:format"]);
	});
});
