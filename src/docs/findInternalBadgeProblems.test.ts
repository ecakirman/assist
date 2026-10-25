import { describe, expect, it } from "vitest";
import type { DocsPage } from "./docsPageSchema";
import { findInternalBadgeProblems } from "./findInternalBadgeProblems";

function page(covers: string[], body: string): DocsPage {
	return {
		id: "cli-sessions",
		title: "assist sessions",
		group: "CLI",
		order: 0,
		covers,
		body,
	};
}

const cliIds = new Set(["cli:sessions", "cli:sessions rename", "cli:update"]);
const internal = new Map([["cli:sessions rename", "/rename"]]);

describe("findInternalBadgeProblems", () => {
	it("passes when an internal command is marked", () => {
		expect(
			findInternalBadgeProblems(
				[
					page(
						["cli:sessions rename"],
						"- `assist sessions rename <title>` :badge[internal] retitles the card.",
					),
				],
				cliIds,
				internal,
			),
		).toEqual([]);
	});

	it("fails when an internal command is not marked", () => {
		expect(
			findInternalBadgeProblems(
				[page(["cli:sessions rename"], "- `assist sessions rename <title>`")],
				cliIds,
				internal,
			),
		).toEqual([
			"cli-sessions: cli:sessions rename is internal (called by /rename) but not marked :badge[internal]",
		]);
	});

	it("fails when the badge marks a command that is not internal or no command", () => {
		expect(
			findInternalBadgeProblems(
				[
					page(
						["cli:update"],
						"- `assist update` :badge[internal]\n- :badge[internal]",
					),
				],
				cliIds,
				internal,
			),
		).toEqual([
			"cli-sessions: :badge[internal] marks cli:update, which is not internal",
			"cli-sessions: :badge[internal] marks no command",
		]);
	});
});
