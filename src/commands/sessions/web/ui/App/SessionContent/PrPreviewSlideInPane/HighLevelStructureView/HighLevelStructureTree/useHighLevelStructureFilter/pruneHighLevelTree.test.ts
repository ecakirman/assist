import { describe, expect, it } from "vitest";
import type { HighLevelTreeNode } from "../../../../../../../../../review/highLevel/types";
import { pruneHighLevelTree } from "./pruneHighLevelTree";
import { highLevelTreeFixture } from "../../../highLevelTreeFixture";

function paths(nodes: HighLevelTreeNode[]): string[] {
	return nodes.flatMap((node) =>
		node.kind === "file" ? [node.path] : [node.path, ...paths(node.children)],
	);
}

describe("pruneHighLevelTree", () => {
	it("keeps matching files and their ancestor folders", () => {
		expect(
			paths(
				pruneHighLevelTree(highLevelTreeFixture, new Set(["src/lib/util.ts"])),
			),
		).toEqual(["src", "src/lib", "src/lib/util.ts"]);
	});

	it("drops folders with no matching descendants", () => {
		expect(
			paths(pruneHighLevelTree(highLevelTreeFixture, new Set(["src/app.ts"]))),
		).toEqual(["src", "src/app.ts"]);
	});

	it("returns an empty tree when nothing matches", () => {
		expect(pruneHighLevelTree(highLevelTreeFixture, new Set())).toEqual([]);
	});

	it("leaves the input tree untouched", () => {
		const before = paths(highLevelTreeFixture);

		pruneHighLevelTree(highLevelTreeFixture, new Set(["README.md"]));

		expect(paths(highLevelTreeFixture)).toEqual(before);
	});
});
