import { describe, expect, it } from "vitest";
import { findLongPaths } from "./findLongPaths";

describe("findLongPaths", () => {
	it("returns no paths when every file is within the limit", () => {
		expect(findLongPaths(["/r/src/a.ts"], "/r", 10)).toEqual([]);
	});

	it("measures paths from the repo root and lists the longest first", () => {
		expect(
			findLongPaths(
				["/r/src/a.ts", "/r/src/abc/d.ts", "/r/src/ab/cd.ts", "/r/src/abcd.ts"],
				"/r",
				10,
			),
		).toEqual([
			{ path: "src/ab/cd.ts", length: 12 },
			{ path: "src/abc/d.ts", length: 12 },
			{ path: "src/abcd.ts", length: 11 },
		]);
	});
});
