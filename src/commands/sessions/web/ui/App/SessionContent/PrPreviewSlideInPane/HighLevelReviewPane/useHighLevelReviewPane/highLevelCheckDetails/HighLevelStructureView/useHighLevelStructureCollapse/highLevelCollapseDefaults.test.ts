import { describe, expect, it } from "vitest";
import type {
	HighLevelTreeDir,
	HighLevelTreeFile,
	HighLevelTreeNode,
} from "../../../../../../../../../../../review/highLevel/types";
import { highLevelCollapseDefaults } from "./highLevelCollapseDefaults";

function file(path: string): HighLevelTreeFile {
	return {
		kind: "file",
		name: path.split("/").at(-1) ?? path,
		path,
		status: "modified",
		additions: 1,
		deletions: 1,
		diffUrl: "",
	};
}

function dir(path: string, children: HighLevelTreeNode[]): HighLevelTreeDir {
	return {
		kind: "dir",
		name: path,
		path,
		additions: 0,
		deletions: 0,
		children,
	};
}

const tree: HighLevelTreeNode[] = [
	dir("src", [
		dir("src/generated", [file("src/generated/schema.ts")]),
		dir("src/lib", [file("src/lib/util.ts"), file("src/lib/util.test.ts")]),
		dir("src/specs", [
			file("src/specs/a.test.ts"),
			file("src/specs/b.test.tsx"),
		]),
	]),
	file("README.md"),
	file("root.test.js"),
];

const globs = ["**/*.test.*", "**/generated/**"];

describe("highLevelCollapseDefaults", () => {
	it("maps each matching file to the first glob it matched", () => {
		const { fileGlobs } = highLevelCollapseDefaults(tree, globs);

		expect(Object.fromEntries(fileGlobs)).toEqual({
			"src/generated/schema.ts": "**/generated/**",
			"src/lib/util.test.ts": "**/*.test.*",
			"src/specs/a.test.ts": "**/*.test.*",
			"src/specs/b.test.tsx": "**/*.test.*",
			"root.test.js": "**/*.test.*",
		});
	});

	it("collapses only directories whose files all match", () => {
		const { dirs } = highLevelCollapseDefaults(tree, globs);

		expect([...dirs].sort()).toEqual(["src/generated", "src/specs"]);
	});

	it("collapses a parent whose every descendant file matches", () => {
		const { dirs } = highLevelCollapseDefaults(
			[dir("gen", [dir("gen/generated", [file("gen/generated/a.ts")])])],
			globs,
		);

		expect([...dirs].sort()).toEqual(["gen", "gen/generated"]);
	});

	it("collapses nothing without globs", () => {
		const { dirs, fileGlobs } = highLevelCollapseDefaults(tree, []);

		expect(dirs.size).toBe(0);
		expect(fileGlobs.size).toBe(0);
	});
});
