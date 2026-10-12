export function slugFromUrl(url: string | undefined): string {
	const match = /github\.com\/([^/]+\/[^/]+)\//.exec(url ?? "");
	return match ? match[1] : "unknown/unknown";
}
