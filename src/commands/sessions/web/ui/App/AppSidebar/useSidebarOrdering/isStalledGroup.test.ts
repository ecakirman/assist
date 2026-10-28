import { describe, expect, it } from "vitest";
import { makeSessionInfo } from "../../../../../../../test/mothers/makeSessionInfo";
import { isStalledGroup } from "./isStalledGroup";
import type { SessionInfo } from "../../../types";

const NOW = 1_000_000;
const THRESHOLD_MS = 300_000;

const stalled = (id: string, overrides: Partial<SessionInfo> = {}) =>
	makeSessionInfo({
		id,
		status: "waiting",
		waitingSince: NOW - THRESHOLD_MS,
		...overrides,
	});

function check(
	members: SessionInfo[],
	{
		activeId = null,
		starred = [],
		openedAt = 0,
	}: { activeId?: string | null; starred?: string[]; openedAt?: number } = {},
) {
	return isStalledGroup(members, {
		now: NOW,
		thresholdMs: THRESHOLD_MS,
		activeId,
		isStarred: (s) => starred.includes(s.id),
		openedAt,
	});
}

describe("isStalledGroup", () => {
	it("is stalled when every member has waited past the threshold", () => {
		expect(check([stalled("a"), stalled("b")])).toBe(true);
	});

	it("is not stalled while any member has waited less than the threshold", () => {
		expect(
			check([stalled("a"), stalled("b", { waitingSince: NOW - 1000 })]),
		).toBe(false);
	});

	it("is not stalled while any member is running", () => {
		expect(check([stalled("a"), stalled("b", { status: "running" })])).toBe(
			false,
		);
	});

	it("is not stalled while any member is done", () => {
		expect(check([stalled("a"), stalled("b", { status: "done" })])).toBe(false);
	});

	it("is not stalled while it holds a starred session", () => {
		expect(check([stalled("a"), stalled("b")], { starred: ["b"] })).toBe(false);
	});

	it("is not stalled while it holds the active session", () => {
		expect(check([stalled("a"), stalled("b")], { activeId: "a" })).toBe(false);
	});

	it("is not stalled until the threshold has passed since the user opened it", () => {
		expect(check([stalled("a"), stalled("b")], { openedAt: NOW - 1000 })).toBe(
			false,
		);
		expect(
			check([stalled("a"), stalled("b")], { openedAt: NOW - THRESHOLD_MS }),
		).toBe(true);
	});
});
