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

import { getBackupStatus } from "./getBackupStatus";

const HOUR_MS = 60 * 60 * 1000;

function run(): [ServerResponse, number, { staleAfterMs: number }] {
	getBackupStatus({} as never, {} as ServerResponse);
	return mockRespondJson.mock.lastCall as [
		ServerResponse,
		number,
		{ staleAfterMs: number },
	];
}

describe("getBackupStatus", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockLoadConfig.mockReturnValue(makeAssistConfig());
	});

	it("defaults the stale threshold to 32h", () => {
		const [, status, body] = run();
		expect(status).toBe(200);
		expect(body).toEqual({ staleAfterMs: 32 * HOUR_MS });
	});

	it("reports the configured backup.staleAfter in milliseconds", () => {
		mockLoadConfig.mockReturnValue(
			makeAssistConfig({ backup: { dir: "~/b", staleAfter: "48h" } }),
		);
		expect(run()[2]).toEqual({ staleAfterMs: 48 * HOUR_MS });
	});
});
