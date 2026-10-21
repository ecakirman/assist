import { describe, expect, it } from "vitest";
import { githubItemUrl } from "./githubItemUrl";

const origin = "https://github.com";
const notPull = () => false;
const pull = () => true;

function pane(pathname: string, search: string, isPull = notPull) {
	return githubItemUrl({ origin, pathname, search }, isPull);
}

describe("githubItemUrl", () => {
	it("trims a pull request subpage to the pull request", () => {
		expect(
			githubItemUrl({
				origin,
				pathname: "/org/repo/pull/12/files",
				search: "",
			}),
		).toBe("https://github.com/org/repo/pull/12");
	});

	it("keeps an issue URL", () => {
		expect(
			githubItemUrl({ origin, pathname: "/org/repo/issues/7", search: "" }),
		).toBe("https://github.com/org/repo/issues/7");
	});

	it("ignores pages that are not an issue or pull request", () => {
		expect(
			githubItemUrl({ origin, pathname: "/org/repo/issues/new", search: "" }),
		).toBe(undefined);
		expect(
			githubItemUrl({ origin, pathname: "/org/repo/pulls", search: "" }),
		).toBe(undefined);
	});

	it("resolves an issue in an org project pane", () => {
		expect(
			pane(
				"/orgs/acme/projects/6/views/1",
				"?pane=issue&itemId=1&issue=acme%7Cmy-repo%7C497",
			),
		).toBe("https://github.com/acme/my-repo/issues/497");
	});

	it("resolves an issue in a user project pane", () => {
		expect(
			pane("/users/someone/projects/2", "?pane=issue&issue=someone|r.js|3"),
		).toBe("https://github.com/someone/r.js/issues/3");
	});

	it("resolves a pull request in a project pane from its item link", () => {
		expect(
			pane(
				"/orgs/acme/projects/6/views/1",
				"?pane=issue&issue=acme%7Crepo%7C12",
				pull,
			),
		).toBe("https://github.com/acme/repo/pull/12");
	});

	it("ignores project views without a resolvable pane item", () => {
		const path = "/orgs/acme/projects/6/views/1";
		expect(pane(path, "")).toBe(undefined);
		expect(pane(path, "?issue=acme%7Crepo%7C1")).toBe(undefined);
		expect(pane(path, "?pane=info&issue=acme%7Crepo%7C1")).toBe(undefined);
		expect(pane(path, "?pane=issue")).toBe(undefined);
		expect(pane(path, "?pane=issue&issue=acme%7Crepo")).toBe(undefined);
		expect(pane(path, "?pane=issue&issue=acme%7Crepo%7Cx")).toBe(undefined);
		expect(pane(path, "?pane=issue&issue=a%2Fb%7Crepo%7C1")).toBe(undefined);
	});

	it("ignores pane params outside a project view", () => {
		expect(pane("/acme/repo", "?pane=issue&issue=acme%7Crepo%7C1")).toBe(
			undefined,
		);
		expect(
			pane("/orgs/acme/projects", "?pane=issue&issue=acme%7Crepo%7C1"),
		).toBe(undefined);
	});
});
