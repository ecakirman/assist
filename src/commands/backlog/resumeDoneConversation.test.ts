import {
	beforeEach,
	describe,
	expect,
	it,
	type MockInstance,
	vi,
} from "vitest";
import { makeBacklogItem } from "../../test/mothers/makeBacklogItem";

vi.mock("../../shared/spawnClaude", () => ({
	spawnClaude: vi.fn(),
}));

import { spawnClaude } from "../../shared/spawnClaude";
import { resumeDoneConversation } from "./resumeDoneConversation";

const mockSpawnClaude = spawnClaude as unknown as MockInstance;

describe("resumeDoneConversation", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(console, "log").mockImplementation(() => {});
	});

	it("resumes the Claude session without a nudge prompt", async () => {
		mockSpawnClaude.mockReturnValue({ done: Promise.resolve(0) });
		const item = makeBacklogItem({ status: "done" });

		const result = await resumeDoneConversation(
			{ kind: "resume-done", item, resumeSessionId: "sess-1" },
			{ allowEdits: false },
		);

		expect(result).toBe(true);
		expect(mockSpawnClaude).toHaveBeenCalledWith("", {
			allowEdits: false,
			resumeSessionId: "sess-1",
		});
	});

	it("returns false when Claude exits non-zero", async () => {
		mockSpawnClaude.mockReturnValue({ done: Promise.resolve(1) });
		const item = makeBacklogItem({ status: "done" });

		const result = await resumeDoneConversation({
			kind: "resume-done",
			item,
			resumeSessionId: "sess-1",
		});

		expect(result).toBe(false);
	});
});
