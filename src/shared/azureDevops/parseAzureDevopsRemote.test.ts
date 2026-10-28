import { describe, expect, it } from "vitest";
import { parseAzureDevopsRemote } from "./parseAzureDevopsRemote";
import { sameAzureDevopsRepo } from "./sameAzureDevopsRepo";

const expected = { org: "acme", project: "Web App", repo: "site" };

describe("parseAzureDevopsRemote", () => {
	it.each([
		"https://acme@dev.azure.com/acme/Web%20App/_git/site",
		"https://dev.azure.com/acme/Web%20App/_git/site/",
		"https://acme.visualstudio.com/Web%20App/_git/site",
		"https://acme.visualstudio.com/DefaultCollection/Web%20App/_git/site",
		"git@ssh.dev.azure.com:v3/acme/Web%20App/site",
		"ssh://git@ssh.dev.azure.com/v3/acme/Web%20App/site",
		"acme@vs-ssh.visualstudio.com:v3/acme/Web%20App/site",
	])("reads %s", (remote) => {
		expect(parseAzureDevopsRemote(remote)).toEqual(expected);
	});

	it.each([
		"git@github.com:org/repo.git",
		"https://github.com/org/repo",
		"https://dev.azure.com/acme/proj",
	])("rejects %s", (remote) => {
		expect(parseAzureDevopsRemote(remote)).toBeNull();
	});
});

describe("sameAzureDevopsRepo", () => {
	it("matches regardless of case", () => {
		expect(
			sameAzureDevopsRepo(expected, {
				org: "ACME",
				project: "web app",
				repo: "Site",
			}),
		).toBe(true);
	});

	it("tells repos in different projects apart", () => {
		expect(
			sameAzureDevopsRepo(expected, { ...expected, project: "Other" }),
		).toBe(false);
	});
});
