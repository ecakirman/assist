export function normalizeBasePath(basePath: string): string {
	const trimmed = basePath.replace(/^\/+|\/+$/g, "");
	return trimmed ? `/${trimmed}/` : "/";
}
