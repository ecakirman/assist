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
		sections: [{ heading: "Intro", markdown: "Hello" }],
	};
}

const inventoryIds = ["cli:update", "cli:sync", "config:commit.push"];

function problems(input: Partial<Parameters<typeof checkDocsCoverage>[0]>) {
	return checkDocsCoverage({
		inventoryIds,
		pages: [],
		pending: {},
		...input,
	}).filter(Boolean);
}

describe("checkDocsCoverage", () => {
	it("passes when every item is covered or pending", () => {
		expect(
			problems({
				pages: [page("getting-started", ["cli:update", "cli:sync"])],
				pending: { "git-github": ["config:commit.push"] },
			}),
		).toEqual([]);
	});

	it("fails when an item is neither covered nor pending", () => {
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

	it("fails when a pending item is already covered", () => {
		expect(
			problems({
				pages: [page("getting-started", inventoryIds)],
				pending: { "getting-started": ["cli:update"] },
			}),
		).toEqual([
			expect.stringMatching(
				/still in pendingUserDocumentation.*\n {2}cli:update$/,
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

	it("fails when pending lists an unknown id or the same id twice", () => {
		const result = problems({
			pages: [page("getting-started", ["cli:update"])],
			pending: {
				"git-github": ["config:commit.push", "cli:gone"],
				"repo-tooling": ["cli:sync", "config:commit.push"],
			},
		});
		expect(result).toEqual([
			expect.stringMatching(/ids not in the inventory.*\n {2}cli:gone$/),
			expect.stringMatching(/more than once:\n {2}config:commit\.push$/),
		]);
	});
});
