import { type HunkData, parseDiff } from "react-diff-view";
import { describe, expect, it } from "vitest";
import {
	exceedsTokenizeLimits,
	MAX_TOKENIZED_FILE_LENGTH,
	MAX_TOKENIZED_LINE_LENGTH,
} from "./exceedsTokenizeLimits";

function hunksFor(lines: string[]): HunkData[] {
	const body = lines.map((line) => `+${line}`).join("\n");
	const diff = `diff --git a/a.js b/a.js
--- a/a.js
+++ b/a.js
@@ -0,0 +1,${lines.length} @@
${body}
`;
	return parseDiff(diff)[0].hunks;
}

describe("exceedsTokenizeLimits", () => {
	it("allows normal-sized source lines", () => {
		expect(exceedsTokenizeLimits(hunksFor(["const a = 1;", "a();"]))).toBe(
			false,
		);
	});

	it("allows a line at the length limit", () => {
		const line = "x".repeat(MAX_TOKENIZED_LINE_LENGTH);
		expect(exceedsTokenizeLimits(hunksFor([line]))).toBe(false);
	});

	it("rejects a minified line over the length limit", () => {
		const line = "x".repeat(217_000);
		expect(exceedsTokenizeLimits(hunksFor(["a();", line]))).toBe(true);
	});

	it("rejects many short lines that exceed the file limit together", () => {
		const line = "x".repeat(MAX_TOKENIZED_LINE_LENGTH);
		const count = Math.ceil(MAX_TOKENIZED_FILE_LENGTH / line.length) + 1;
		expect(exceedsTokenizeLimits(hunksFor(Array(count).fill(line)))).toBe(true);
	});
});
