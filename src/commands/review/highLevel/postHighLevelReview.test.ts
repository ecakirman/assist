import { beforeEach, describe, expect, it, vi } from "vitest";
import { postHighLevelReview } from "./postHighLevelReview";

const mockExecFileSync = vi.fn();

vi.mock("node:child_process", () => ({
	execFileSync: (...args: unknown[]) => mockExecFileSync(...args),
}));

const apiArgs = [
	"api",
	"repos/org/repo/pulls/42/reviews",
	"--method",
	"POST",
	"--input",
	"-",
];

function postedPayload(): unknown {
	const [, args, options] = mockExecFileSync.mock.calls[0] as [
		string,
		string[],
		{ input: string },
	];
	expect(args).toEqual(apiArgs);
	return JSON.parse(options.input);
}

beforeEach(() => {
	mockExecFileSync.mockReset();
});

describe("postHighLevelReview", () => {
	it("approves without a body when the body is empty", () => {
		postHighLevelReview("org/repo", 42, {
			event: "APPROVE",
			body: "",
			comments: [],
		});

		expect(postedPayload()).toEqual({ event: "APPROVE", comments: [] });
	});

	it.each(["APPROVE", "COMMENT", "REQUEST_CHANGES"] as const)(
		"submits %s with the body",
		(event) => {
			postHighLevelReview("org/repo", 42, {
				event,
				body: "**Tests**\n\nGood",
				comments: [],
			});

			expect(postedPayload()).toEqual({
				event,
				body: "**Tests**\n\nGood",
				comments: [],
			});
		},
	);

	it("posts line-level comments on their side, with a start line for ranges", () => {
		postHighLevelReview("org/repo", 42, {
			event: "COMMENT",
			body: "",
			comments: [
				{ path: "a.ts", startLine: 4, endLine: 4, quote: "x", note: "one" },
				{
					path: "b.ts",
					startLine: 2,
					endLine: 5,
					quote: "y",
					note: "range",
					startSide: "LEFT",
					side: "RIGHT",
				},
			],
		});

		expect(postedPayload()).toEqual({
			event: "COMMENT",
			comments: [
				{ path: "a.ts", body: "one", line: 4, side: "RIGHT" },
				{
					path: "b.ts",
					body: "range",
					line: 5,
					side: "RIGHT",
					start_line: 2,
					start_side: "LEFT",
				},
			],
		});
	});

	it("rethrows gh stderr as the error message", () => {
		mockExecFileSync.mockImplementation(() => {
			throw Object.assign(new Error("failed"), {
				stderr: "Can not approve your own pull request\n",
			});
		});

		expect(() =>
			postHighLevelReview("org/repo", 42, {
				event: "APPROVE",
				body: "",
				comments: [],
			}),
		).toThrow("Can not approve your own pull request");
	});
});
