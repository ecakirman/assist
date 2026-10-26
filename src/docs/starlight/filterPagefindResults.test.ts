import { describe, expect, it } from "vitest";
import { filterPagefindResults } from "./filterPagefindResults";
import { matchesQueryWord } from "./matchesQueryWord";

function filter<R extends ReturnType<typeof result>>(
	response: { results: R[] } | null,
	term: unknown,
) {
	return filterPagefindResults(response, term, matchesQueryWord);
}

function result(content: string, matchedWords: string[], title = "Page") {
	const words = content.split(/\s+/);
	const locations = matchedWords.map((word) => words.indexOf(word));
	return { data: async () => ({ content, locations, meta: { title } }) };
}

describe("filterPagefindResults", () => {
	it("drops results whose matched words are only compound parts of the query", async () => {
		const response = { results: [result("a comment on a rule", ["a"])] };

		const filtered = await filter(response, "adv");

		expect(filtered?.results).toEqual([]);
	});

	it("keeps results that contain each query word as a prefix", async () => {
		const page = result("Add to review adds the note", ["Add", "adds"]);

		const filtered = await filter({ results: [page] }, "ad");

		expect(filtered?.results).toEqual([page]);
	});

	it("keeps stemmed matches", async () => {
		const page = result("Start a run from the card", ["run"]);

		const filtered = await filter({ results: [page] }, "running");

		expect(filtered?.results).toEqual([page]);
	});

	it("drops results when the query extends a matched word with a non-inflection", async () => {
		const pages = [
			result("Start a run from the card", ["run"]),
			result("clone git@github.com:staff0rd/assist.git.", [
				"git@github.com:staff0rd/assist.git.",
			]),
		];

		expect((await filter({ results: pages }, "runz"))?.results).toEqual([]);
		expect((await filter({ results: pages }, "commx"))?.results).toEqual([]);
	});

	it("keeps inflected forms of a matched word", async () => {
		const page = result("Pick an entry to commit", ["entry", "commit"]);

		const filtered = await filter({ results: [page] }, "entries committed");

		expect(filtered?.results).toEqual([page]);
	});

	it("keeps results that match only in the title", async () => {
		const page = result("Nothing relevant here", [], "Worktrees");

		const filtered = await filter({ results: [page] }, "worktree");

		expect(filtered?.results).toEqual([page]);
	});

	it("requires every query word to match", async () => {
		const page = result("assist config set a key", ["config", "a"]);

		const filtered = await filter({ results: [page] }, "config adv");

		expect(filtered?.results).toEqual([]);
	});

	it("passes through superseded searches and filter-only searches", async () => {
		expect(await filter(null, "adv")).toBeNull();
		const response = { results: [result("a", ["a"])] };
		expect(await filter(response, null)).toBe(response);
	});
});
