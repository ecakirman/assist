import { describe, expect, it } from "vitest";
import { highLevelTreeFixture } from "./highLevelTreeFixture";
import { countHighLevelDiffs } from "./countHighLevelDiffs";

function count(dirs: string[], files: string[]) {
	return countHighLevelDiffs(
		highLevelTreeFixture,
		new Set(dirs),
		new Set(files),
	);
}

describe("countHighLevelDiffs", () => {
	it("counts every file open when nothing is collapsed", () => {
		expect(count([], [])).toEqual({ open: 3, collapsed: 0 });
	});

	it("counts collapsed file diffs as collapsed", () => {
		expect(count([], ["README.md"])).toEqual({ open: 2, collapsed: 1 });
	});

	it("counts expanded files under a collapsed folder as collapsed", () => {
		expect(count(["src"], [])).toEqual({ open: 1, collapsed: 2 });
	});

	it("counts files under a collapsed nested folder as collapsed", () => {
		expect(count(["src/lib"], ["README.md"])).toEqual({
			open: 1,
			collapsed: 2,
		});
	});

	it("does not double count a collapsed file inside a collapsed folder", () => {
		expect(count(["src"], ["src/app.ts", "README.md"])).toEqual({
			open: 0,
			collapsed: 3,
		});
	});
});
