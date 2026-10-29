import { describe, expect, it } from "vitest";
import {
	type AzureDevopsThread,
	mapAzureDevopsThreads,
} from "./mapAzureDevopsThreads";

const prUrl = "https://dev.azure.com/acme/Web%20App/_git/site/pullrequest/7";

function thread(overrides: Partial<AzureDevopsThread>): AzureDevopsThread {
	return {
		id: 12,
		status: "active",
		threadContext: { filePath: "/src/foo.ts", rightFileStart: { line: 4 } },
		comments: [
			{
				id: 1,
				author: { displayName: "Alice", uniqueName: "alice@acme.com" },
				content: "Please rename this.",
				commentType: "text",
			},
		],
		...overrides,
	};
}

describe("mapAzureDevopsThreads", () => {
	it("maps a file thread to a line comment keyed by the thread id", () => {
		expect(mapAzureDevopsThreads([thread({})], prUrl)).toEqual([
			{
				type: "line",
				id: 12,
				threadId: "12",
				user: "Alice",
				path: "src/foo.ts",
				line: 4,
				body: "Please rename this.",
				diff_hunk: "",
				html_url: `${prUrl}?discussionId=12`,
				resolved: false,
			},
		]);
	});

	it("gives every comment in a thread the thread id", () => {
		const comments = mapAzureDevopsThreads(
			[
				thread({
					comments: [
						{ id: 1, content: "First.", commentType: "text" },
						{ id: 2, content: "Second.", commentType: "text" },
					],
				}),
			],
			prUrl,
		);

		expect(comments.map((c) => [c.id, c.body])).toEqual([
			[12, "First."],
			[12, "Second."],
		]);
	});

	it.each([
		["fixed", true],
		["wontFix", true],
		["closed", true],
		["byDesign", true],
		["active", false],
		["pending", false],
		[undefined, false],
	])("treats status %s as resolved=%s", (status, resolved) => {
		const [comment] = mapAzureDevopsThreads([thread({ status })], prUrl);
		expect(comment?.resolved).toBe(resolved);
	});

	it("drops system comments, deleted comments and deleted threads", () => {
		const comments = mapAzureDevopsThreads(
			[
				thread({
					id: 1,
					comments: [
						{ id: 1, content: "Alice voted 10", commentType: "system" },
						{ id: 2, content: "Gone", commentType: "text", isDeleted: true },
					],
				}),
				thread({ id: 2, isDeleted: true }),
			],
			prUrl,
		);

		expect(comments).toEqual([]);
	});

	it("maps a PR-level thread with no file context", () => {
		const [comment] = mapAzureDevopsThreads(
			[thread({ threadContext: null })],
			prUrl,
		);

		expect(comment).toMatchObject({ path: "", line: null });
	});

	it("falls back to the left-side line for a comment on a deleted line", () => {
		const [comment] = mapAzureDevopsThreads(
			[
				thread({
					threadContext: { filePath: "/a.ts", leftFileStart: { line: 9 } },
				}),
			],
			prUrl,
		);

		expect(comment?.line).toBe(9);
	});
});
