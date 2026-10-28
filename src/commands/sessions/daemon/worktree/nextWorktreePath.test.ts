import { describe, expect, it } from "vitest";
import { nextWorktreePath } from "./nextWorktreePath";

describe("nextWorktreePath", () => {
	it("picks the first adjacent suffix starting at -2", () => {
		expect(nextWorktreePath("/git/foo", "/git", () => false)).toBe(
			"/git/foo-2",
		);
	});

	it("skips taken suffixes and never clobbers an existing path", () => {
		const taken = new Set(["/git/foo-2", "/git/foo-3"]);
		expect(nextWorktreePath("/git/foo", "/git", (p) => taken.has(p))).toBe(
			"/git/foo-4",
		);
	});

	it("honours a configured root distinct from the clone's parent", () => {
		expect(nextWorktreePath("/git/foo", "/scratch", () => false)).toBe(
			"/scratch/foo-2",
		);
	});
});
