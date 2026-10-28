import { describe, expect, it } from "vitest";
import { makeSessionInfo } from "../../../../../../../../../../../../../../test/mothers/makeSessionInfo";
import { groupStatusTally } from "./groupStatusTally";

describe("groupStatusTally", () => {
	it("counts waiting, running and done in that order, omitting empty statuses", () => {
		const tally = groupStatusTally([
			makeSessionInfo({ id: "a", status: "done" }),
			makeSessionInfo({ id: "b", status: "waiting" }),
			makeSessionInfo({ id: "c", status: "waiting" }),
			makeSessionInfo({ id: "d", status: "running" }),
			makeSessionInfo({ id: "e", status: "error" }),
		]);

		expect(tally).toEqual([
			{ status: "waiting", count: 2 },
			{ status: "running", count: 1 },
			{ status: "done", count: 1 },
		]);
	});

	it("returns nothing when no session has a tallied status", () => {
		expect(
			groupStatusTally([makeSessionInfo({ id: "a", status: "stopped" })]),
		).toEqual([]);
	});
});
