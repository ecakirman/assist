import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
	type AzureDevopsRepo,
	parseAzureDevopsRemote,
} from "../../../../shared/azureDevops/parseAzureDevopsRemote";
import { sameAzureDevopsRepo } from "../../../../shared/azureDevops/sameAzureDevopsRepo";
import { remoteUrl } from "../../../backlog/remoteUrl";

function clonesRepo(dir: string, repo: AzureDevopsRepo): boolean {
	if (!existsSync(join(dir, ".git"))) return false;
	const url = remoteUrl(dir).url;
	const remote = url ? parseAzureDevopsRemote(url) : null;
	return remote !== null && sameAzureDevopsRepo(remote, repo);
}

export function findAzureDevopsClone(
	repo: AzureDevopsRepo,
	baseDir: string,
): string | undefined {
	if (!existsSync(baseDir)) return undefined;
	const named = join(baseDir, repo.repo);
	const others = readdirSync(baseDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => join(baseDir, entry.name))
		.filter((dir) => dir !== named)
		.sort();
	return [named, ...others].find((dir) => clonesRepo(dir, repo));
}
