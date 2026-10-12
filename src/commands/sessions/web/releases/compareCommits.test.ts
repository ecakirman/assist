import { beforeEach, describe, expect, it, vi } from "vitest";
import { compareCommits } from "./compareCommits";
import { ghJson } from "./ghJson";

vi.mock("./ghJson", () => ({ ghJson: vi.fn() }));

const ghJsonMock = vi.mocked(ghJson);

function apiCommit(index: number) {
	return {
		sha: `sha${index}`,
		commit: {
			message: `subject ${index}\n\nbody`,
			author: { name: "Ada" },
			committer: { date: `2026-10-0${(index % 9) + 1}T00:00:00Z` },
		},
	};
}

function range(from: number, to: number) {
	return Array.from({ length: to - from + 1 }, (_, i) => apiCommit(from + i));
}

beforeEach(() => {
	ghJsonMock.mockReset();
});

describe("compareCommits", () => {
	it("maps the range newest first", async () => {
		ghJsonMock.mockResolvedValue({
			total_commits: 2,
			commits: range(1, 2),
		} as never);

		const result = await compareCommits("/repo", "o/r", "live", "queued");

		expect(ghJsonMock.mock.calls[0]?.[1]?.[1]).toBe(
			"repos/o/r/compare/live...queued?per_page=50&page=1",
		);
		expect(result).toEqual({
			total: 2,
			commits: [
				{
					sha: "sha2",
					subject: "subject 2",
					author: "Ada",
					date: "2026-10-03T00:00:00Z",
				},
				{
					sha: "sha1",
					subject: "subject 1",
					author: "Ada",
					date: "2026-10-02T00:00:00Z",
				},
			],
		});
	});

	it("keeps the newest 50 of a longer range", async () => {
		ghJsonMock.mockImplementation((async (_cwd: string, args: string[]) => {
			const page = Number(/page=(\d+)$/.exec(args[1] ?? "")?.[1]);
			const from = (page - 1) * 50 + 1;
			return {
				total_commits: 120,
				commits: range(from, Math.min(from + 49, 120)),
			};
		}) as never);

		const result = await compareCommits("/repo", "o/r", "live", "queued");

		expect(result.total).toBe(120);
		expect(result.commits).toHaveLength(50);
		expect(result.commits[0]?.sha).toBe("sha120");
		expect(result.commits[49]?.sha).toBe("sha71");
	});

	it("returns just the queued commit without a base", async () => {
		ghJsonMock.mockResolvedValue(apiCommit(7) as never);

		const result = await compareCommits("/repo", "o/r", null, "sha7");

		expect(ghJsonMock.mock.calls[0]?.[1]?.[1]).toBe("repos/o/r/commits/sha7");
		expect(result.total).toBe(1);
		expect(result.commits.map((c) => c.sha)).toEqual(["sha7"]);
	});
});
