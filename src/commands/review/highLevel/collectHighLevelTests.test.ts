import { describe, expect, it } from "vitest";
import { collectHighLevelTests } from "./collectHighLevelTests";
import type { HighLevelFile } from "./types";

function file(
	path: string,
	status: HighLevelFile["status"] = "modified",
): HighLevelFile {
	return { path, status, additions: 1, deletions: 0, diffUrl: `#${path}` };
}

describe("collectHighLevelTests", () => {
	it("reads each matching test file through the given reader", () => {
		const read: string[] = [];
		const tests = collectHighLevelTests(
			[
				file("src/a.test.ts"),
				file("src/a.ts"),
				file("src/b.test.ts", "removed"),
			],
			["**/*.test.ts"],
			(path) => {
				read.push(path);
				return `it("from head", () => {});`;
			},
		);
		expect(read).toEqual(["src/a.test.ts"]);
		expect(tests.map((test) => test.path)).toEqual(["src/a.test.ts"]);
		expect(tests[0]?.tests[0]).toMatchObject({ kind: "it", name: "from head" });
	});

	it("propagates a reader failure instead of skipping the file", () => {
		expect(() =>
			collectHighLevelTests([file("src/a.test.ts")], ["**/*.test.ts"], () => {
				throw new Error("unreadable");
			}),
		).toThrow("unreadable");
	});
});
