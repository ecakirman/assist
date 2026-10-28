import { describe, expect, it } from "vitest";
import { makeSessionInfo } from "../../../../../../../../../../../test/mothers/makeSessionInfo";
import { groupSessions } from "./groupSessions";

describe("groupSessions", () => {
	it("lists every row and its nested children", () => {
		const rows = [
			{
				session: makeSessionInfo({ id: "run" }),
				children: [
					makeSessionInfo({ id: "review" }),
					makeSessionInfo({ id: "fix" }),
				],
			},
			{ session: makeSessionInfo({ id: "solo" }), children: [] },
		];

		expect(groupSessions(rows).map((s) => s.id)).toEqual([
			"run",
			"review",
			"fix",
			"solo",
		]);
	});
});
