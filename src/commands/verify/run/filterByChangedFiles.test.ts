import { describe, expect, it, vi } from "vitest";
import type { VerifyEntry } from "./VerifyEntry";

const mockGetChangedFiles = vi.fn();

vi.mock("./getChangedFiles", () => ({
	getChangedFiles: () => mockGetChangedFiles(),
}));

import { filterByChangedFiles } from "./filterByChangedFiles";

const roots = ["coach-tools", "member-app"];

const entries: VerifyEntry[] = [
	{
		name: "coach-tools:verify:lint",
		fullCommand: "npm run verify:lint",
		filter: "coach-tools/**",
	},
	{
		name: "member-app:verify:lint",
		fullCommand: "npm run verify:lint",
		filter: "member-app/**",
	},
	{
		name: "verify:format",
		fullCommand: "npm run verify:format",
		outsideRoots: roots,
	},
	{ name: "verify:always", fullCommand: "true" },
];

function namesFor(changedFiles: string[]): string[] {
	mockGetChangedFiles.mockReturnValue(changedFiles);
	return filterByChangedFiles(entries).map((e) => e.name);
}

describe("filterByChangedFiles", () => {
	it("runs only the changed root's scripts", () => {
		expect(namesFor(["coach-tools/src/app.ts"])).toEqual([
			"coach-tools:verify:lint",
			"verify:always",
		]);
	});

	it("runs repo-root scripts for changes outside every root", () => {
		expect(namesFor([".github/workflows/ci.yml"])).toEqual([
			"verify:format",
			"verify:always",
		]);
	});

	it("does not treat a sibling with a root's prefix as under that root", () => {
		expect(namesFor(["coach-tools-old/x.ts"])).toEqual([
			"verify:format",
			"verify:always",
		]);
	});

	it("runs only ungated entries when nothing changed", () => {
		expect(namesFor([])).toEqual(["verify:always"]);
	});

	it("runs everything gated when changes span roots and the repo root", () => {
		expect(
			namesFor(["coach-tools/a.ts", "member-app/b.ts", "package.json"]),
		).toEqual([
			"coach-tools:verify:lint",
			"member-app:verify:lint",
			"verify:format",
			"verify:always",
		]);
	});
});
