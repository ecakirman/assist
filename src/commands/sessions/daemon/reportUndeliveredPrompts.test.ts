import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeSession } from "../../../test/mothers/makeSession";
import { finishStatusChange } from "./finishStatusChange";
import { recordPromptJournal } from "./recordPromptJournal";
import { reportUndeliveredPrompts } from "./reportUndeliveredPrompts";
import { daemonRestartInterruption } from "./SessionInterruption";

vi.mock("./daemonLog", () => ({ daemonLog: vi.fn() }));
vi.mock("./recordPromptJournal", () => ({ recordPromptJournal: vi.fn() }));
vi.mock("./flushPhaseActiveMs", () => ({ flushPhaseActiveMs: vi.fn() }));
vi.mock("./startTranscriptTitleGeneration", () => ({
	startTranscriptTitleGeneration: vi.fn(),
}));

const deps = { dismiss: vi.fn(), notify: vi.fn() };

beforeEach(() => vi.clearAllMocks());

describe("reportUndeliveredPrompts", () => {
	it("journals each queued prompt in full and clears the queue", () => {
		const s = makeSession({ pendingPrompts: ["one", "two"] });
		reportUndeliveredPrompts(s, "dismissed");
		expect(recordPromptJournal).toHaveBeenCalledWith({
			event: "undelivered",
			sessionId: s.id,
			text: "two",
			message: "dismissed",
		});
		expect(recordPromptJournal).toHaveBeenCalledTimes(2);
		expect(s.pendingPrompts).toBeUndefined();
	});

	it("reports queued prompts when the session ends", () => {
		const s = makeSession({ status: "waiting", pendingPrompts: ["one"] });
		finishStatusChange(s, "done", 0, deps);
		expect(recordPromptJournal).toHaveBeenCalledWith(
			expect.objectContaining({ event: "undelivered", text: "one" }),
		);
	});

	it("keeps queued prompts when a daemon restart ends the session", () => {
		const s = makeSession({
			status: "waiting",
			pendingPrompts: ["one"],
			interrupted: daemonRestartInterruption(),
		});
		finishStatusChange(s, "error", 1, deps);
		expect(recordPromptJournal).not.toHaveBeenCalled();
		expect(s.pendingPrompts).toEqual(["one"]);
	});
});
