import type { ServerResponse } from "node:http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadConfig } from "../../../shared/loadConfig";
import { makeAssistConfig } from "../../../test/mothers/makeAssistConfig";
import type * as loadConfigMockModule from "../../../test/mocks/loadConfigMock";

const mockLoadConfig = vi.mocked(loadConfig);
const mockRespondJson = vi.fn();

vi.mock("../../../shared/loadConfig", async () =>
	(
		await vi.importActual<typeof loadConfigMockModule>(
			"../../../test/mocks/loadConfigMock",
		)
	).loadConfigMock(),
);

vi.mock("../../../shared/web", () => ({
	respondJson: (...args: unknown[]) => mockRespondJson(...args),
}));

import { sessionView } from "./sessionView";

type Body = {
	parkWaitingAfterMs: number;
};

function run(): [ServerResponse, number, Body] {
	const res = {} as ServerResponse;
	sessionView({} as never, res);
	return mockRespondJson.mock.lastCall as [ServerResponse, number, Body];
}

describe("sessionView", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockLoadConfig.mockReturnValue(makeAssistConfig({ sessions: {} }));
	});

	it("defaults the park threshold to five minutes", () => {
		const [, status, body] = run();
		expect(status).toBe(200);
		expect(body).toEqual({ parkWaitingAfterMs: 300_000 });
	});

	it("defaults the park threshold when there is no sessions config at all", () => {
		mockLoadConfig.mockReturnValue(makeAssistConfig());
		const [, , body] = run();
		expect(body.parkWaitingAfterMs).toBe(300_000);
	});

	it("reports the configured sessions.parkWaitingAfterMs threshold", () => {
		mockLoadConfig.mockReturnValue(
			makeAssistConfig({ sessions: { parkWaitingAfterMs: 60_000 } }),
		);
		const [, , body] = run();
		expect(body.parkWaitingAfterMs).toBe(60_000);
	});
});
