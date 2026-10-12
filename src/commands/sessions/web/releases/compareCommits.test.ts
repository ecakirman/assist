import { beforeEach, describe, expect, it, vi } from "vitest";
import { compareCommits } from "./compareCommits";
import { ghJson } from "./ghJson";

vi.mock("./ghJson", () => ({ ghJson: vi.fn() }));

const ghJsonMock = vi.mocked(ghJson);

function apiCommit(sha: string, parents: string[], subject = `subject ${sha}`) {
	return {
		sha,
		parents,
		commit: {
			message: `${subject}\n\nbody`,
			author: { name: "Ada" },
			committer: { date: "2026-10-01T00:00:00Z" },
		},
	};
}

type PrNode = { number: number; mergeCommit: string };

function prNodes(prs: PrNode[]) {
	return prs.map((pr) => ({
		number: pr.number,
		title: `PR ${pr.number}`,
		url: `pull/${pr.number}`,
		author: { login: "grace" },
		mergeCommit: { oid: pr.mergeCommit },
	}));
}

function graphqlResponse(args: string[], prs: Record<string, PrNode[]>) {
	const query = args.find((arg) => arg.startsWith("query=")) ?? "";
	const shas = [...query.matchAll(/object\(oid:"([^"]+)"\)/g)].map(
		(match) => match[1] ?? "",
	);
	return {
		data: {
			repository: Object.fromEntries(
				shas.map((sha, index) => [
					`c${index}`,
					{ associatedPullRequests: { nodes: prNodes(prs[sha] ?? []) } },
				]),
			),
		},
	};
}

function mockGh(commits: unknown[], prs: Record<string, PrNode[]> = {}) {
	ghJsonMock.mockImplementation((async (_cwd: string, args: string[]) => {
		const endpoint = args[1] ?? "";
		if (endpoint === "graphql") return graphqlResponse(args, prs);
		if (endpoint.includes("/commits/")) return commits[0];
		const page = Number(/page=(\d+)$/.exec(endpoint)?.[1]);
		return {
			total_commits: commits.length,
			commits: commits.slice((page - 1) * 100, page * 100),
		};
	}) as never);
}

beforeEach(() => {
	ghJsonMock.mockReset();
});

describe("compareCommits", () => {
	it("folds a merged PR's branch commits into one change, newest first", async () => {
		mockGh(
			[
				apiCommit("branch1", ["live"]),
				apiCommit("direct", ["live"], "chore: direct push"),
				apiCommit("merge", ["direct", "branch1"]),
			],
			{
				merge: [{ number: 12, mergeCommit: "merge" }],
				direct: [{ number: 9, mergeCommit: "elsewhere" }],
			},
		);

		const result = await compareCommits("/repo", "o/r", "live", "merge");

		expect(result).toEqual({
			total: 2,
			changes: [
				{
					sha: "merge",
					subject: "PR 12",
					author: "grace",
					date: "2026-10-01T00:00:00Z",
					pr: { number: 12, url: "pull/12" },
				},
				{
					sha: "direct",
					subject: "chore: direct push",
					author: "Ada",
					date: "2026-10-01T00:00:00Z",
					pr: null,
				},
			],
		});
	});

	it("keeps the newest 50 changes of a longer range", async () => {
		mockGh(
			Array.from({ length: 220 }, (_, i) =>
				apiCommit(`sha${i + 1}`, i === 0 ? ["live"] : [`sha${i}`]),
			),
		);

		const result = await compareCommits("/repo", "o/r", "live", "sha220");

		expect(result.total).toBe(220);
		expect(result.changes).toHaveLength(50);
		expect(result.changes[0]?.sha).toBe("sha220");
		expect(result.changes[49]?.sha).toBe("sha171");
	});

	it("returns just the queued commit without a base", async () => {
		mockGh([apiCommit("sha7", ["sha6"])], {
			sha7: [{ number: 3, mergeCommit: "sha7" }],
		});

		const result = await compareCommits("/repo", "o/r", null, "sha7");

		expect(ghJsonMock.mock.calls[0]?.[1]?.[1]).toBe("repos/o/r/commits/sha7");
		expect(result.total).toBe(1);
		expect(result.changes.map((c) => c.pr?.number)).toEqual([3]);
	});
});
