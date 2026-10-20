import type { IncomingMessage, ServerResponse } from "node:http";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockRespondJson = vi.fn();
const mockExecFile = vi.fn();

vi.mock("../../../shared/web", () => ({
	respondJson: (...args: unknown[]) => mockRespondJson(...args),
}));

vi.mock("node:child_process", () => ({
	execFile: (...args: unknown[]) => mockExecFile(...args),
}));

import { githubFileContent } from "./githubFileContent";

type Callback = (error: unknown, result?: { stdout: string }) => void;

function ghReturns(stdout: string) {
	mockExecFile.mockImplementation((...args: unknown[]) =>
		(args.at(-1) as Callback)(null, { stdout }),
	);
}

function ghFails(stderr: string) {
	mockExecFile.mockImplementation((...args: unknown[]) =>
		(args.at(-1) as Callback)(Object.assign(new Error("exit 1"), { stderr })),
	);
}

async function request(
	query: string,
): Promise<[number, Record<string, unknown>]> {
	await githubFileContent(
		{ url: `/api/github-file?${query}` } as IncomingMessage,
		{} as ServerResponse,
	);
	const [, status, body] = mockRespondJson.mock.lastCall as [
		ServerResponse,
		number,
		Record<string, unknown>,
	];
	return [status, body];
}

const valid = "repo=acme/app&sha=abc1234&path=src/app.ts";

describe("githubFileContent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns the raw file at the sha", async () => {
		ghReturns("line 1\nline 2\n");

		const [status, body] = await request(valid);

		expect(status).toBe(200);
		expect(body.content).toBe("line 1\nline 2\n");
	});

	it("asks gh for the raw contents at the ref", async () => {
		ghReturns("");

		await request("repo=acme/app&sha=abc1234&path=src/a%20b.ts");

		const [command, args] = mockExecFile.mock.lastCall as [string, string[]];
		expect(command).toBe("gh");
		expect(args).toEqual([
			"api",
			"-H",
			"Accept: application/vnd.github.raw",
			"repos/acme/app/contents/src/a%20b.ts?ref=abc1234",
		]);
	});

	it("passes gh's reason through when the fetch fails", async () => {
		ghFails("gh: Not Found (HTTP 404)\n");

		const [status, body] = await request(valid);

		expect(status).toBe(502);
		expect(body.error).toBe("gh: Not Found (HTTP 404)");
	});

	it.each([
		["a repo without an owner", "repo=app&sha=abc1234&path=a.ts"],
		["a sha that is not hex", "repo=acme/app&sha=main;rm&path=a.ts"],
		["a missing path", "repo=acme/app&sha=abc1234"],
		["a path that climbs out", "repo=acme/app&sha=abc1234&path=../a.ts"],
		["an absolute path", "repo=acme/app&sha=abc1234&path=/etc/hosts"],
	])("rejects %s without calling gh", async (_label, query) => {
		const [status] = await request(query);

		expect(status).toBe(400);
		expect(mockExecFile).not.toHaveBeenCalled();
	});
});
