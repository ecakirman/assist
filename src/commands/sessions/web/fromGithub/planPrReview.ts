import { parseAzureDevopsPrUrl } from "../../../../shared/azureDevops/parseAzureDevopsPrUrl";
import { planAzureDevopsReview } from "./planAzureDevopsReview";
import { planGithubReview } from "./planGithubReview";

export function planPrReview(
	body: unknown,
	baseDir: string,
): ReturnType<typeof planGithubReview> {
	const { url, args } = (body ?? {}) as Record<string, unknown>;
	const azurePr = typeof url === "string" && parseAzureDevopsPrUrl(url.trim());
	return azurePr
		? planAzureDevopsReview(azurePr, args, baseDir)
		: planGithubReview(body, baseDir);
}
