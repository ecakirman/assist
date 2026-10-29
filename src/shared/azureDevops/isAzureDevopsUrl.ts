export function isAzureDevopsUrl(url: string): boolean {
	let host: string;
	try {
		host = new URL(url).hostname.toLowerCase();
	} catch {
		return false;
	}
	return host === "dev.azure.com" || host.endsWith(".visualstudio.com");
}
