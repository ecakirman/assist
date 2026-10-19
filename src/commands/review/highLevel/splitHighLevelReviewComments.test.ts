import { describe, expect, it } from "vitest";
import type { PreviewReviewComment } from "../../sessions/shared/PreviewDecision";
import { splitHighLevelReviewComments } from "./splitHighLevelReviewComments";

const patch = [
	"@@ -1,3 +1,3 @@",
	" keep",
	"-old",
	"+new",
	" keep",
	"@@ -20,2 +20,3 @@",
	" keep",
	"+added",
	" keep",
].join("\n");

const files = [{ path: "src/a.ts", patch }, { path: "src/binary.png" }];

function comment(
	fields: Partial<PreviewReviewComment> & Pick<PreviewReviewComment, "path">,
): PreviewReviewComment {
	return { startLine: 2, endLine: 2, quote: "q", note: "n", ...fields };
}

describe("splitHighLevelReviewComments", () => {
	it.each([
		["an added line", comment({ path: "src/a.ts" })],
		[
			"a range within one hunk",
			comment({ path: "src/a.ts", startLine: 20, endLine: 22 }),
		],
		[
			"a removed line on the old side",
			comment({ path: "src/a.ts", startSide: "LEFT", side: "LEFT" }),
		],
		[
			"a range from the old side to the new side",
			comment({
				path: "src/a.ts",
				startLine: 2,
				endLine: 3,
				startSide: "LEFT",
				side: "RIGHT",
			}),
		],
	])("keeps %s line-level", (_label, queued) => {
		expect(splitHighLevelReviewComments([queued], files)).toEqual({
			lineLevel: [queued],
			remainder: [],
		});
	});

	it.each([
		[
			"a line outside every hunk",
			comment({ path: "src/a.ts", startLine: 10, endLine: 10 }),
		],
		[
			"a range spanning two hunks",
			comment({ path: "src/a.ts", startLine: 3, endLine: 20 }),
		],
		["a file without a patch", comment({ path: "src/binary.png" })],
		["a file outside the PR", comment({ path: "src/other.ts" })],
	])("moves %s to the PR-level remainder", (_label, queued) => {
		expect(splitHighLevelReviewComments([queued], files)).toEqual({
			lineLevel: [],
			remainder: [queued],
		});
	});
});
