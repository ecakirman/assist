import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadConfig } from "../../shared/loadConfig";
import type * as loadConfigMockModule from "../../test/mocks/loadConfigMock";
import { makeAssistConfig } from "../../test/mothers/makeAssistConfig";
import { prsSlackChannel } from "./prsSlackChannel";

vi.mock("../../shared/loadConfig", async () =>
	(
		await vi.importActual<typeof loadConfigMockModule>(
			"../../test/mocks/loadConfigMock",
		)
	).loadConfigMock(),
);

const mockLoadConfig = vi.mocked(loadConfig);
const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
	throw new Error("process.exit");
});
const mockError = vi.spyOn(console, "error").mockImplementation(() => {});
const mockLog = vi.spyOn(console, "log").mockImplementation(() => {});

beforeEach(() => {
	vi.clearAllMocks();
});

describe("prsSlackChannel", () => {
	it("prints prs.slack even when slack.channel is set", () => {
		mockLoadConfig.mockReturnValue(
			makeAssistConfig({
				prs: { slack: "#pull-requests" },
				slack: { channel: "#general" },
			}),
		);

		prsSlackChannel();

		expect(mockLog).toHaveBeenCalledWith("#pull-requests");
		expect(mockExit).not.toHaveBeenCalled();
	});

	it("falls back to slack.channel when prs.slack is empty", () => {
		mockLoadConfig.mockReturnValue(
			makeAssistConfig({
				prs: { slack: " " },
				slack: { channel: "#general" },
			}),
		);

		prsSlackChannel();

		expect(mockLog).toHaveBeenCalledWith("#general");
	});

	it("exits non-zero naming both keys when neither is set", () => {
		mockLoadConfig.mockReturnValue(makeAssistConfig());

		expect(() => prsSlackChannel()).toThrow("process.exit");

		expect(mockExit).toHaveBeenCalledWith(1);
		const message = mockError.mock.calls[0][0] as string;
		expect(message).toContain("prs.slack");
		expect(message).toContain("slack.channel");
		expect(mockLog).not.toHaveBeenCalled();
	});
});
