import {
	type AzureDevopsRepo,
	parseAzureDevopsRemote,
} from "../../shared/azureDevops/parseAzureDevopsRemote";
import { remoteUrl } from "../backlog/remoteUrl";

export function azureDevopsRemote(cwd: string): AzureDevopsRepo | null {
	const url = remoteUrl(cwd).url;
	return url ? parseAzureDevopsRemote(url) : null;
}
