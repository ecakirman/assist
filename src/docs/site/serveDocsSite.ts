import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const contentTypes: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".png": "image/png",
	".svg": "image/svg+xml",
};

function resolveFile(outDir: string, relative: string): string | undefined {
	const target = join(outDir, normalize(relative).replace(/^(\.\.[/\\])+/, ""));
	if (existsSync(target) && statSync(target).isDirectory())
		return resolveFile(outDir, join(relative, "index.html"));
	return existsSync(target) ? target : undefined;
}

export function serveDocsSite(
	outDir: string,
	basePath: string,
	port: number,
): void {
	createServer((req, res) => {
		const pathname = decodeURIComponent(
			new URL(req.url ?? "/", "http://localhost").pathname,
		);
		const file = pathname.startsWith(basePath)
			? resolveFile(outDir, pathname.slice(basePath.length))
			: undefined;
		if (!file) {
			res.writeHead(404, { "content-type": "text/plain" });
			res.end(`Not found: ${pathname} (site is served under ${basePath})`);
			return;
		}
		res.writeHead(200, {
			"content-type": contentTypes[extname(file)] ?? "application/octet-stream",
		});
		res.end(readFileSync(file));
	}).listen(port, () => {
		console.log(`Previewing docs at http://localhost:${port}${basePath}`);
	});
}
