import { describe, expect, it } from "vitest";
import { azureDevopsThreadRequests } from "./azureDevopsThreadRequests";
import { azDevopsInvokeArgs } from "./invokeAzDevops";

const pr = { org: "acme", project: "Web App", repo: "site", prId: 7 };

describe("azureDevopsThreadRequests", () => {
	it("posts a text reply on the thread", () => {
		expect(azureDevopsThreadRequests.reply(pr, 12, "Done.")).toEqual({
			org: "acme",
			resource: "pullRequestThreadComments",
			routeParameters: {
				project: "Web App",
				repositoryId: "site",
				pullRequestId: 7,
				threadId: 12,
			},
			method: "POST",
			body: { content: "Done.", commentType: 1 },
		});
	});

	it.each(["fixed", "wontFix"] as const)(
		"patches the thread status to %s",
		(status) => {
			expect(azureDevopsThreadRequests.status(pr, 12, status)).toMatchObject({
				resource: "pullRequestThreads",
				routeParameters: { threadId: 12 },
				method: "PATCH",
				body: { status },
			});
		},
	);

	it("lists the PR's threads with a GET", () => {
		const request = azureDevopsThreadRequests.list(pr);

		expect(request.method).toBeUndefined();
		expect(request.routeParameters).toEqual({
			project: "Web App",
			repositoryId: "site",
			pullRequestId: 7,
		});
	});
});

describe("azDevopsInvokeArgs", () => {
	it("passes each route parameter as its own argument", () => {
		const args = azDevopsInvokeArgs(
			azureDevopsThreadRequests.status(pr, 12, "fixed"),
			"/tmp/body.json",
		);

		expect(args).toEqual([
			"devops",
			"invoke",
			"--area",
			"git",
			"--resource",
			"pullRequestThreads",
			"--route-parameters",
			"project=Web App",
			"repositoryId=site",
			"pullRequestId=7",
			"threadId=12",
			"--org",
			"https://dev.azure.com/acme",
			"--api-version",
			"7.1",
			"--http-method",
			"PATCH",
			"--in-file",
			"/tmp/body.json",
			"--only-show-errors",
			"-o",
			"json",
		]);
	});
});
