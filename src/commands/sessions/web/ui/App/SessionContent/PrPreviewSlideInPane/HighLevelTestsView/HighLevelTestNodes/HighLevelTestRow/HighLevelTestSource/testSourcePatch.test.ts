import { describe, expect, it } from "vitest";
import { testSourcePatch } from "./testSourcePatch";

describe("testSourcePatch", () => {
	it("numbers the source from the test's line as unchanged context", () => {
		expect(testSourcePatch('it("a", () => {\n\texpect(1);\n});', 12)).toBe(
			'@@ -12,3 +12,3 @@\n it("a", () => {\n \texpect(1);\n });',
		);
	});
});
