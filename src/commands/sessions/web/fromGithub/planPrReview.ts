import { isAzureDevopsUrl } from "../../../../shared/azureDevops/isAzureDevopsUrl";
import { parseAzureDevopsPrUrl } from "../../../../shared/azureDevops/parseAzureDevopsPrUrl";
import { planAzureDevopsReview } from "./planAzureDevopsReview";
import { planGithubReview } from "./planGithubReview";

export function planPrReview(
	body: unknown,
	baseDir: string,
): ReturnType<typeof planGithubReview> {
	const { url, args } = (body ?? {}) as Record<string, unknown>;
	const trimmed = typeof url === "string" ? url.trim() : "";
	const azurePr = parseAzureDevopsPrUrl(trimmed);
	if (azurePr) return planAzureDevopsReview(azurePr, args, baseDir);
	if (isAzureDevopsUrl(trimmed))
		return {
			ok: false,
			status: 400,
			error: `Not an Azure DevOps PR URL: ${trimmed} (expected https://dev.azure.com/<org>/<project>/_git/<repo>/pullrequest/<id>)`,
		};
	return planGithubReview(body, baseDir);
}
