import { describe, expect, it } from "vitest";
import { parseDiffFiles } from "./parseDiffFiles";

describe("parseDiffFiles", () => {
	it("drops the tab git appends to names containing spaces", () => {
		const diff = [
			"diff --git a/sp ace b/sp ace",
			"index 587be6b..df18491 100644",
			"--- a/sp ace\t",
			"+++ b/sp ace\t",
			"@@ -1 +1,2 @@",
			" x",
			"+y",
			"",
		].join("\n");

		const [file] = parseDiffFiles(diff);

		expect(file.oldPath).toBe("sp ace");
		expect(file.newPath).toBe("sp ace");
	});
});
