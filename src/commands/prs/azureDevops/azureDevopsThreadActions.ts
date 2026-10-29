import type { AzureDevopsRepo } from "../../../shared/azureDevops/parseAzureDevopsRemote";
import {
	type AzureDevopsPrRef,
	type AzureDevopsThreadStatus,
	azureDevopsThreadRequests,
} from "./azureDevopsThreadRequests";
import { currentAzureDevopsPr } from "./currentAzureDevopsPr";
import { failAzureDevops } from "./failAzureDevops";
import { invokeAzDevops } from "./invokeAzDevops";

function attempt<T>(run: () => T): T {
	try {
		return run();
	} catch (error) {
		failAzureDevops(error);
	}
}

export const azureDevopsThreadActions = {
	currentPr(repo: AzureDevopsRepo): AzureDevopsPrRef {
		return attempt(() => currentAzureDevopsPr(repo));
	},

	reply(pr: AzureDevopsPrRef, threadId: number, content: string): void {
		attempt(() =>
			invokeAzDevops(azureDevopsThreadRequests.reply(pr, threadId, content)),
		);
	},

	setStatus(
		pr: AzureDevopsPrRef,
		threadId: number,
		status: AzureDevopsThreadStatus,
	): void {
		attempt(() =>
			invokeAzDevops(azureDevopsThreadRequests.status(pr, threadId, status)),
		);
	},
};
