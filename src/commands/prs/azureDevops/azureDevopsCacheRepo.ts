import type { AzureDevopsRepo } from "../../../shared/azureDevops/parseAzureDevopsRemote";

export function azureDevopsCacheRepo({ org, project, repo }: AzureDevopsRepo) {
	return { org, repo: `${project}/${repo}` };
}
