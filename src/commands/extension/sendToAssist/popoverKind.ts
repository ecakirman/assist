import { parseAzureDevopsPrUrl } from "../../../shared/azureDevops/parseAzureDevopsPrUrl";
import { githubPullNumber } from "../../../shared/githubPullNumber";
import type { AssistPopoverKind } from "./assistPopoverContent";

export type AssistSendTarget = (() => string) | { link: () => Promise<string> };

export function popoverKind(
	placement: "comment" | "header",
	target: AssistSendTarget,
): AssistPopoverKind {
	if (typeof target !== "function") return "link";
	if (placement !== "header") return "instructions";
	const url = target();
	if (parseAzureDevopsPrUrl(url)) return "azure-devops-review";
	return githubPullNumber(url) ? "review" : "instructions";
}
