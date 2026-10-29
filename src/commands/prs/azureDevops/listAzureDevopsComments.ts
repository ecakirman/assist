import type { AzureDevopsRepo } from "../../../shared/azureDevops/parseAzureDevopsRemote";
import { commentsCachePath } from "../commentsCachePath";
import type { ListCommentsResult } from "../listComments/printComments";
import { updateCommentsCache } from "../listComments/updateCommentsCache";
import { azureDevopsCacheRepo } from "./azureDevopsCacheRepo";
import { azureDevopsRepoUrl } from "./azureDevopsRepoUrl";
import { azureDevopsThreadRequests } from "./azureDevopsThreadRequests";
import { currentAzureDevopsPr } from "./currentAzureDevopsPr";
import { failAzureDevops } from "./failAzureDevops";
import { invokeAzDevops } from "./invokeAzDevops";
import {
	type AzureDevopsThread,
	mapAzureDevopsThreads,
} from "./mapAzureDevopsThreads";

export function listAzureDevopsComments(
	repo: AzureDevopsRepo,
): ListCommentsResult {
	try {
		const pr = currentAzureDevopsPr(repo);
		const response = invokeAzDevops(azureDevopsThreadRequests.list(pr)) as {
			value?: AzureDevopsThread[];
		} | null;
		const comments = mapAzureDevopsThreads(
			response?.value ?? [],
			`${azureDevopsRepoUrl(pr)}/pullrequest/${pr.prId}`,
		);
		const { org, repo: cacheRepo } = azureDevopsCacheRepo(pr);
		updateCommentsCache(org, cacheRepo, pr.prId, comments);
		const cachePath =
			comments.length > 0 ? commentsCachePath(org, cacheRepo, pr.prId) : null;
		return { comments, cachePath };
	} catch (error) {
		failAzureDevops(error);
	}
}
