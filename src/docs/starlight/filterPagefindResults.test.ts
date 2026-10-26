import { describe, expect, it } from "vitest";
import { filterPagefindResults } from "./filterPagefindResults";

function result(content: string, matchedWords: string[], title = "Page") {
	const words = content.split(/\s+/);
	const locations = matchedWords.map((word) => words.indexOf(word));
	return { data: async () => ({ content, locations, meta: { title } }) };
}

describe("filterPagefindResults", () => {
	it("drops results whose matched words are only compound parts of the query", async () => {
		const response = { results: [result("a comment on a rule", ["a"])] };

		const filtered = await filterPagefindResults(response, "adv");

		expect(filtered?.results).toEqual([]);
	});

	it("keeps results that contain each query word as a prefix", async () => {
		const page = result("Add to review adds the note", ["Add", "adds"]);

		const filtered = await filterPagefindResults({ results: [page] }, "ad");

		expect(filtered?.results).toEqual([page]);
	});

	it("keeps stemmed matches", async () => {
		const page = result("Start a run from the card", ["run"]);

		const filtered = await filterPagefindResults(
			{ results: [page] },
			"running",
		);

		expect(filtered?.results).toEqual([page]);
	});

	it("keeps results that match only in the title", async () => {
		const page = result("Nothing relevant here", [], "Worktrees");

		const filtered = await filterPagefindResults(
			{ results: [page] },
			"worktree",
		);

		expect(filtered?.results).toEqual([page]);
	});

	it("requires every query word to match", async () => {
		const page = result("assist config set a key", ["config", "a"]);

		const filtered = await filterPagefindResults(
			{ results: [page] },
			"config adv",
		);

		expect(filtered?.results).toEqual([]);
	});

	it("passes through superseded searches and filter-only searches", async () => {
		expect(await filterPagefindResults(null, "adv")).toBeNull();
		const response = { results: [result("a", ["a"])] };
		expect(await filterPagefindResults(response, null)).toBe(response);
	});
});
