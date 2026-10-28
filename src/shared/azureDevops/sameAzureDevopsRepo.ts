import type { AzureDevopsRepo } from "./parseAzureDevopsRemote";

export function sameAzureDevopsRepo(
	a: AzureDevopsRepo,
	b: AzureDevopsRepo,
): boolean {
	return (
		a.org.toLowerCase() === b.org.toLowerCase() &&
		a.project.toLowerCase() === b.project.toLowerCase() &&
		a.repo.toLowerCase() === b.repo.toLowerCase()
	);
}
