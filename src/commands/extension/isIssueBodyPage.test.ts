import { describe, expect, it } from "vitest";
import { isIssueBodyPage } from "./isIssueBodyPage";

const notPull = () => false;
const pull = () => true;

function page(pathname: string, search = "", isPull = notPull) {
	return isIssueBodyPage({ pathname, search }, isPull);
}

describe("isIssueBodyPage", () => {
	it("matches an issue page", () => {
		expect(page("/staff0rd/assist/issues/42")).toBe(true);
	});

	it("matches an issue page with a trailing segment", () => {
		expect(page("/staff0rd/assist/issues/42/")).toBe(true);
	});

	it("matches the new-issue form", () => {
		expect(page("/staff0rd/assist/issues/new")).toBe(true);
	});

	it("matches the new-issue form with a template query path", () => {
		expect(page("/staff0rd/assist/issues/new/choose")).toBe(true);
	});

	it("rejects the issue list", () => {
		expect(page("/staff0rd/assist/issues")).toBe(false);
	});

	it("rejects a pull request", () => {
		expect(page("/staff0rd/assist/pull/42")).toBe(false);
	});

	it("rejects the dashboard", () => {
		expect(page("/")).toBe(false);
	});

	it("matches an issue in an org project pane", () => {
		expect(
			page(
				"/orgs/makerx/projects/6/views/1",
				"?pane=issue&issue=staff0rd%7Cassist%7C497",
			),
		).toBe(true);
	});

	it("matches an issue in a user project pane", () => {
		expect(
			page(
				"/users/staff0rd/projects/2/views/3",
				"?pane=issue&issue=staff0rd%7Cassist%7C497",
			),
		).toBe(true);
	});

	it("rejects a pull request in a project pane", () => {
		expect(
			page(
				"/orgs/makerx/projects/6/views/1",
				"?pane=issue&issue=staff0rd%7Cassist%7C12",
				pull,
			),
		).toBe(false);
	});

	it("rejects a project view with no pane open", () => {
		expect(page("/orgs/makerx/projects/6/views/1")).toBe(false);
	});

	it("rejects a project pane with a malformed item", () => {
		expect(
			page("/orgs/makerx/projects/6/views/1", "?pane=issue&issue=assist%7C497"),
		).toBe(false);
	});
});
