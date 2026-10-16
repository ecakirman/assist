import { describe, expect, it } from "vitest";
import { sessionToggles } from "./sessionToggles";
import { makeSessionInfo } from "../../../../../test/mothers/makeSessionInfo";

const backlogActivity = {
	kind: "backlog" as const,
	startedAt: 0,
	phase: 1,
	totalPhases: 3,
};

describe("sessionToggles auto-start", () => {
	it.each(["draft", "bug", "refine"])(
		"offers an auto-start toggle, off by default, on a %s session",
		(command) => {
			expect(
				sessionToggles(
					makeSessionInfo({ commandType: "assist", assistArgs: [command] }),
				),
			).toEqual([{ key: "autoStart", label: "Auto-start", checked: false }]);
		},
	);

	it("captions auto-start when it is switched on", () => {
		expect(
			sessionToggles(
				makeSessionInfo({
					commandType: "assist",
					assistArgs: ["draft"],
					autoStart: true,
				}),
			),
		).toEqual([
			{
				key: "autoStart",
				label: "Auto-start",
				checked: true,
				caption: "will auto-start",
			},
		]);
	});

	it("offers no auto-start toggle on other sessions", () => {
		expect(sessionToggles(makeSessionInfo({ commandType: "claude" }))).toEqual(
			[],
		);
	});
});

describe("sessionToggles continue", () => {
	it("captions a backlog run only when continue is switched off", () => {
		expect(
			sessionToggles(
				makeSessionInfo({ commandType: "assist", activity: backlogActivity }),
			),
		).toEqual([{ key: "autoAdvance", label: "Continue", checked: true }]);
		expect(
			sessionToggles(
				makeSessionInfo({
					commandType: "assist",
					activity: backlogActivity,
					autoAdvance: false,
				}),
			),
		).toEqual([
			{
				key: "autoAdvance",
				label: "Continue",
				checked: false,
				caption: "won't continue",
			},
		]);
	});
});

describe("sessionToggles dismiss", () => {
	const review = {
		commandType: "assist" as const,
		activity: {
			kind: "backlog" as const,
			startedAt: 0,
			phase: 3,
			totalPhases: 3,
		},
	};

	it("captions the review phase only when dismiss is switched on", () => {
		expect(
			sessionToggles(makeSessionInfo({ ...review, autoAdvance: false })),
		).toEqual([{ key: "autoAdvance", label: "Dismiss", checked: false }]);
		expect(
			sessionToggles(makeSessionInfo({ ...review, autoAdvance: true })),
		).toEqual([
			{
				key: "autoAdvance",
				label: "Dismiss",
				checked: true,
				caption: "will dismiss",
			},
		]);
	});
});
