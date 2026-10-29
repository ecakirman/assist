import type { AzureDevopsRepo } from "../../../shared/azureDevops/parseAzureDevopsRemote";

export function azureDevopsRepoUrl({ org, project, repo }: AzureDevopsRepo) {
	return `https://dev.azure.com/${encodeURIComponent(org)}/${encodeURIComponent(project)}/_git/${encodeURIComponent(repo)}`;
}
