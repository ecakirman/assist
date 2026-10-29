import { describe, expect, it } from "vitest";
import { checkDocsCoverage } from "./checkDocsCoverage";
import type { DocsPage } from "./docsPageSchema";

function page(id: string, covers: string[]): DocsPage {
	return {
		id,
		title: id,
		group: "Getting started",
		order: 0,
		covers,
	};
}

const inventoryIds = ["cli:update", "cli:sync", "config:commit.push"];

function problems(input: Partial<Parameters<typeof checkDocsCoverage>[0]>) {
	return checkDocsCoverage({
		inventoryIds,
		pages: [],
		...input,
	}).filter(Boolean);
}

describe("checkDocsCoverage", () => {
	it("passes when every item is covered", () => {
		expect(
			problems({ pages: [page("getting-started", inventoryIds)] }),
		).toEqual([]);
	});

	it("fails when an item is covered by no page", () => {
		expect(
			problems({
				pages: [page("getting-started", ["cli:update", "cli:sync"])],
			}),
		).toEqual([
			expect.stringMatching(
				/documented by no page.*:\n {2}config:commit\.push$/,
			),
		]);
	});

	it("fails when a page covers an id outside the inventory", () => {
		expect(
			problems({
				pages: [page("getting-started", [...inventoryIds, "cli:missing"])],
			}),
		).toEqual([
			expect.stringMatching(
				/not in the inventory:\n {2}getting-started: cli:missing$/,
			),
		]);
	});
});
