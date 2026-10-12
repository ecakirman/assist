import { describe, expect, it } from "vitest";
import { selectEntriesForMode } from "./selectEntriesForMode";

const entries = [
	"coach-tools:verify:lint",
	"coach-tools:verify:lint:fix",
	"coach-tools:verify:types",
	"verify:format:fix",
	"verify:format",
	"verify:knip:fix",
].map((name) => ({ name, fullCommand: `npm run ${name}` }));

function selectedNames(mode: "check" | "fix"): string[] {
	return selectEntriesForMode(entries, mode).map((e) => e.name);
}

describe("selectEntriesForMode", () => {
	it("prefers the :fix variant in fix mode and keeps unpaired entries", () => {
		expect(selectedNames("fix")).toEqual([
			"coach-tools:verify:lint:fix",
			"coach-tools:verify:types",
			"verify:format:fix",
			"verify:knip:fix",
		]);
	});

	it("keeps only base entries in check mode, dropping unpaired :fix", () => {
		expect(selectedNames("check")).toEqual([
			"coach-tools:verify:lint",
			"coach-tools:verify:types",
			"verify:format",
		]);
	});
});
