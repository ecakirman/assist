import { describe, expect, it } from "vitest";
import { parseAzureDevopsPrUrl } from "./parseAzureDevopsPrUrl";

describe("parseAzureDevopsPrUrl", () => {
	it("reads a dev.azure.com PR and drops the trailing view", () => {
		expect(
			parseAzureDevopsPrUrl(
				"https://dev.azure.com/acme/Web%20App/_git/site/pullrequest/42?_a=files",
			),
		).toEqual({
			org: "acme",
			project: "Web App",
			repo: "site",
			id: "42",
			url: "https://dev.azure.com/acme/Web%20App/_git/site/pullrequest/42",
		});
	});

	it("reads the org from a visualstudio.com host", () => {
		expect(
			parseAzureDevopsPrUrl(
				"https://acme.visualstudio.com/proj/_git/repo/pullrequest/7/overview",
			),
		).toMatchObject({ org: "acme", project: "proj", repo: "repo", id: "7" });
	});

	it("skips a DefaultCollection segment on visualstudio.com", () => {
		expect(
			parseAzureDevopsPrUrl(
				"https://acme.visualstudio.com/DefaultCollection/proj/_git/repo/pullrequest/7",
			),
		).toMatchObject({ org: "acme", project: "proj", repo: "repo" });
	});

	it.each([
		"https://dev.azure.com/acme/proj/_git/repo",
		"https://dev.azure.com/acme/proj/_git/repo/pullrequests",
		"https://github.com/org/repo/pull/1",
		"https://example.com/proj/_git/repo/pullrequest/1",
		"http://dev.azure.com/acme/proj/_git/repo/pullrequest/1",
		"not a url",
	])("rejects %s", (url) => {
		expect(parseAzureDevopsPrUrl(url)).toBeUndefined();
	});
});
