import type { AzureDevopsRepo } from "../../../shared/azureDevops/parseAzureDevopsRemote";
import type { AzDevopsRequest } from "./invokeAzDevops";

export type AzureDevopsPrRef = AzureDevopsRepo & { prId: number };

export type AzureDevopsThreadStatus = "fixed" | "wontFix";

function prRoute(pr: AzureDevopsPrRef) {
	return {
		project: pr.project,
		repositoryId: pr.repo,
		pullRequestId: pr.prId,
	};
}

export const azureDevopsThreadRequests = {
	list(pr: AzureDevopsPrRef): AzDevopsRequest {
		return {
			org: pr.org,
			resource: "pullRequestThreads",
			routeParameters: prRoute(pr),
		};
	},

	reply(
		pr: AzureDevopsPrRef,
		threadId: number,
		content: string,
	): AzDevopsRequest {
		return {
			org: pr.org,
			resource: "pullRequestThreadComments",
			routeParameters: { ...prRoute(pr), threadId },
			method: "POST",
			body: { content, commentType: 1 },
		};
	},

	status(
		pr: AzureDevopsPrRef,
		threadId: number,
		status: AzureDevopsThreadStatus,
	): AzDevopsRequest {
		return {
			org: pr.org,
			resource: "pullRequestThreads",
			routeParameters: { ...prRoute(pr), threadId },
			method: "PATCH",
			body: { status },
		};
	},
};
