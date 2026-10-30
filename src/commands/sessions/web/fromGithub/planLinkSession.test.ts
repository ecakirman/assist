import { afterEach, describe, expect, it, vi } from "vitest";
import { listClones } from "./listClones";
import { planLinkSession } from "./planLinkSession";

vi.mock("./listClones", () => ({ listClones: vi.fn() }));

const mockList = vi.mocked(listClones);
const URL =
	"https://mail.google.com/mail/u/0/#search/rfc822msgid%3A%3Ca%40b.com%3E";

afterEach(() => vi.clearAllMocks());

describe("planLinkSession", () => {
	it("starts in the picked clone with the link and instructions", () => {
		mockList.mockReturnValue(["/base/other", "/base/repo"]);
		expect(
			planLinkSession(
				{ url: URL, repo: "repo", instructions: " go " },
				"/base",
			),
		).toEqual({ ok: true, cwd: "/base/repo", prompt: `${URL}\n\ngo` });
		expect(mockList).toHaveBeenCalledWith("/base");
	});

	it.each(["draft", "bug"])("carries the %s mode", (mode) => {
		mockList.mockReturnValue(["/base/repo"]);
		expect(planLinkSession({ url: URL, repo: "repo", mode }, "/base")).toEqual({
			ok: true,
			cwd: "/base/repo",
			prompt: URL,
			mode,
		});
	});

	it("reports 400 when no repo is picked", () => {
		expect(planLinkSession({ url: URL }, "/base")).toEqual({
			ok: false,
			status: 400,
			error: "No repo picked",
		});
	});

	it("reports 404 when the picked repo is not cloned", () => {
		mockList.mockReturnValue(["/base/repo"]);
		expect(planLinkSession({ url: URL, repo: "../etc" }, "/base")).toEqual({
			ok: false,
			status: 404,
			error: "../etc is not cloned under /base",
		});
	});

	it.each([undefined, "", "ftp://example.com/x"])(
		"reports 400 for url %s",
		(url) => {
			expect(planLinkSession({ url, repo: "repo" }, "/base")).toMatchObject({
				ok: false,
				status: 400,
			});
		},
	);

	it("reports 400 for an unknown mode", () => {
		expect(
			planLinkSession({ url: URL, repo: "repo", mode: "deploy" }, "/base"),
		).toEqual({ ok: false, status: 400, error: "Unknown mode: deploy" });
	});
});
