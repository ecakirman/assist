import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

const root = join(tmpdir(), "assist-new-session-defaults-test");
const globalConfig = join(root, ".assist.yml");
const apm = join(root, "apm");
const other = join(root, "other");

const mockRespondJson = vi.fn();

vi.mock("../../../shared/web", () => ({
	respondJson: (...args: unknown[]) => mockRespondJson(...args),
}));

vi.mock("node:os", async (importOriginal) => {
	const actual = (await importOriginal()) as Record<string, unknown>;
	return { ...actual, homedir: () => root };
});

vi.mock("../../backlog/getCurrentOrigin", () => ({
	getCurrentOrigin: (cwd: string) =>
		cwd === apm ? "github.com/org/apm" : "github.com/org/other",
}));

import { newSessionDefaults } from "./newSessionDefaults";

mkdirSync(apm, { recursive: true });
mkdirSync(other, { recursive: true });

afterEach(() => rmSync(globalConfig, { force: true }));
afterAll(() => rmSync(root, { recursive: true, force: true }));

function modesFor(...cwds: string[]): unknown {
	const query = cwds.map((cwd) => `cwd=${encodeURIComponent(cwd)}`).join("&");
	const req = { url: `/api/new-session-defaults?${query}` };
	newSessionDefaults(req as IncomingMessage, {} as ServerResponse);
	return mockRespondJson.mock.lastCall?.[2];
}

describe("newSessionDefaults", () => {
	it("applies each repo's override", () => {
		writeFileSync(
			globalConfig,
			"sessions:\n  newSessionMode: bug\nrepos:\n  apm:\n    sessions:\n      newSessionMode: prompt\n",
		);

		expect(modesFor(apm, other)).toEqual({
			modes: { [apm]: "prompt", [other]: "bug" },
		});
	});

	it("falls back to draft when nothing is set", () => {
		expect(modesFor(other)).toEqual({ modes: { [other]: "draft" } });
	});
});
