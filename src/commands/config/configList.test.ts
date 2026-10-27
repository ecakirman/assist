import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTestDb } from "../../shared/db/createTestDb";
import type { Db } from "../../shared/db/Db";
import { loadConfig } from "../../shared/loadConfig";
import { SECRET_MASK } from "../../shared/maskConfigSecrets";
import type * as loadConfigMockModule from "../../test/mocks/loadConfigMock";
import { makeAssistConfig } from "../../test/mothers/makeAssistConfig";
import { addFeed } from "../backlog/addFeed";
import { configList } from "../configList";

let orm: Db;

vi.mock("../../shared/loadConfig", async () =>
	(
		await vi.importActual<typeof loadConfigMockModule>(
			"../../test/mocks/loadConfigMock",
		)
	).loadConfigMock(),
);

vi.mock("../../shared/db/getDb", () => ({
	getDb: () => Promise.resolve(orm),
}));

const mockConfig = vi.mocked(loadConfig);

async function output(run: () => Promise<void>): Promise<string> {
	const lines: string[] = [];
	const log = vi.spyOn(console, "log").mockImplementation((line) => {
		lines.push(String(line));
	});
	try {
		await run();
	} finally {
		log.mockRestore();
	}
	return lines.join("\n");
}

describe("configList", () => {
	beforeEach(async () => {
		({ orm } = await createTestDb());
		vi.clearAllMocks();
	});

	it("masks secrets and keeps the rest of the config readable", async () => {
		mockConfig.mockReturnValue(
			makeAssistConfig({
				commit: { push: true },
				database: { url: "postgres://user:pass@host/db" },
				seq: {
					connections: [{ name: "prod", url: "https://seq", apiToken: "t0k" }],
				},
			}),
		);

		const text = await output(configList);

		expect(text).not.toContain("pass@host");
		expect(text).not.toContain("t0k");
		expect(text).toContain(`url: ${SECRET_MASK}`);
		expect(text).toContain(`apiToken: ${SECRET_MASK}`);
		expect(text).toContain("url: https://seq");
		expect(text).toContain("push: true");
	});

	it("omits an unset secret entirely", async () => {
		mockConfig.mockReturnValue(makeAssistConfig({ commit: { push: true } }));

		expect(await output(configList)).not.toContain(SECRET_MASK);
	});

	it("says it shows only what is set and points at config keys", async () => {
		mockConfig.mockReturnValue(makeAssistConfig({ commit: { push: true } }));

		const text = await output(configList);

		expect(text).toContain("# Only the keys that are set");
		expect(text).toContain("assist config keys");
	});

	it("lists news.feeds from the database", async () => {
		mockConfig.mockReturnValue(
			makeAssistConfig({ database: { url: "postgres://host/db" } }),
		);
		await addFeed(orm, "https://a.example/feed");

		expect(await output(configList)).toContain("- https://a.example/feed");
	});
});
