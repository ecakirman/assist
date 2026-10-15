export function parseGithubOrigin(url: string): string | null {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return null;
	}
	if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
	if (parsed.hostname.toLowerCase() !== "github.com") return null;
	const [owner, repo] = parsed.pathname.split("/").filter(Boolean);
	if (!owner || !repo) return null;
	return `github.com/${owner}/${repo.replace(/\.git$/i, "")}`;
}
