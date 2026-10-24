import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	bracketedPaste,
	SUBMIT,
} from "../shared/pasteAndSubmit/bracketedPaste";
import { typePromptIntoSession } from "./typePromptIntoSession";
import type { Session } from "./types";

vi.mock("./daemonLog", () => ({ daemonLog: vi.fn() }));

function sessions(session?: Partial<Session>): Map<string, Session> {
	return new Map(
		session ? [["s1", { id: "s1", pty: {}, ...session } as Session]] : [],
	);
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("typePromptIntoSession", () => {
	it("pastes the prompt into the session, then submits it", () => {
		const write = vi.fn();
		expect(
			typePromptIntoSession(sessions({ status: "waiting" }), "s1", "hi", write),
		).toBeUndefined();
		expect(write).toHaveBeenCalledWith("s1", bracketedPaste("hi"));
		vi.runAllTimers();
		expect(write).toHaveBeenLastCalledWith("s1", SUBMIT);
	});

	it("refuses a session that does not exist", () => {
		const write = vi.fn();
		expect(typePromptIntoSession(sessions(), "s1", "hi", write)).toBe(
			"assist session s1 was not found",
		);
		expect(write).not.toHaveBeenCalled();
	});

	it("refuses a session that has ended", () => {
		expect(
			typePromptIntoSession(sessions({ status: "done" }), "s1", "hi", vi.fn()),
		).toBe("assist session s1 has ended");
	});
});
