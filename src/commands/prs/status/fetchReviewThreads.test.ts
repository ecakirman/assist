import { execFileSync } from "node:child_process";
import { expect, it, vi } from "vitest";
import { fetchReviewThreads } from "./fetchReviewThreads";

vi.mock("node:child_process", () => ({ execFileSync: vi.fn() }));

it("passes GraphQL variables literally without a shell", () => {
	vi.mocked(execFileSync).mockReturnValue(
		JSON.stringify({
			data: {
				repository: {
					pullRequest: { reviewThreads: { nodes: [{ isResolved: false }] } },
				},
			},
		}),
	);
	expect(fetchReviewThreads("owner", "repo", 1301)).toEqual([
		{ isResolved: false },
	]);
	expect(execFileSync).toHaveBeenCalledWith(
		"gh",
		[
			"api",
			"graphql",
			"-f",
			expect.stringContaining(
				"query=query($owner: String!, $repo: String!, $prNumber: Int!)",
			),
			"-F",
			"owner=owner",
			"-F",
			"repo=repo",
			"-F",
			"prNumber=1301",
		],
		{ encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
	);
});
