import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveRepoLocation } from "../../../backlog/resolveRepoLocation";
import { planGithubSession } from "./planGithubSession";

vi.mock("../../../backlog/resolveRepoLocation", () => ({
	resolveRepoLocation: vi.fn(),
}));

const mockResolve = vi.mocked(resolveRepoLocation);
const URL = "https://github.com/org/repo/pull/12#discussion_r34";

afterEach(() => vi.clearAllMocks());

describe("planGithubSession", () => {
	it("resolves the local clone and uses the link as the prompt", () => {
		mockResolve.mockReturnValue({ cwd: "/base/repo" });
		expect(planGithubSession({ url: URL }, "/base")).toEqual({
			ok: true,
			cwd: "/base/repo",
			prompt: URL,
		});
		expect(mockResolve).toHaveBeenCalledWith(
			"github.com/org/repo",
			undefined,
			"/base",
		);
	});

	it("appends instructions after the link", () => {
		mockResolve.mockReturnValue({ cwd: "/base/repo" });
		expect(
			planGithubSession({ url: URL, instructions: " fix it " }, "/base"),
		).toMatchObject({ prompt: `${URL}\n\nfix it` });
	});

	it("reports 404 when the repo is not cloned", () => {
		mockResolve.mockReturnValue({ cloneTarget: "/base/repo" });
		expect(planGithubSession({ url: URL }, "/base")).toEqual({
			ok: false,
			status: 404,
			error: "org/repo is not cloned under /base",
		});
	});

	it("reports 400 for a non-GitHub URL", () => {
		expect(
			planGithubSession({ url: "https://example.com/a/b" }, "/base"),
		).toMatchObject({ ok: false, status: 400 });
		expect(mockResolve).not.toHaveBeenCalled();
	});

	it("reports 400 when the url is missing", () => {
		expect(planGithubSession({}, "/base")).toEqual({
			ok: false,
			status: 400,
			error: "Missing url",
		});
	});
});
