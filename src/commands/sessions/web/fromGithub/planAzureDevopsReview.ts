import { isAllowedAzureDevopsPrArgs } from "../../../../shared/azureDevops/isAllowedAzureDevopsPrArgs";
import type { AzureDevopsPr } from "../../../../shared/azureDevops/parseAzureDevopsPrUrl";
import { findAzureDevopsClone } from "./findAzureDevopsClone";
import type { GithubPlanError } from "./resolveGithubClone";

export function planAzureDevopsReview(
	pr: AzureDevopsPr,
	args: unknown,
	baseDir: string,
): { ok: true; cwd: string; assistArgs: string[] } | GithubPlanError {
	if (!isAllowedAzureDevopsPrArgs(args))
		return {
			ok: false,
			status: 400,
			error: "Unsupported assist args for an Azure DevOps PR",
		};
	const cwd = findAzureDevopsClone(pr, baseDir);
	if (!cwd)
		return {
			ok: false,
			status: 404,
			error: `${pr.org}/${pr.project}/${pr.repo} is not cloned under ${baseDir}`,
		};
	return { ok: true, cwd, assistArgs: [...args, pr.id] };
}
