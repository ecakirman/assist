import { buildDocsSite } from "./site/buildDocsSite";
import { normalizeBasePath } from "./site/normalizeBasePath";
import { readDocsSiteArgs } from "./site/readDocsSiteArgs";
import { serveDocsSite } from "./site/serveDocsSite";

export function previewDocs(argv: string[]): void {
	const { basePath, outDir, port } = readDocsSiteArgs(argv);
	try {
		buildDocsSite(basePath, outDir);
	} catch (error) {
		console.error((error as Error).message);
		process.exit(1);
	}
	serveDocsSite(outDir, normalizeBasePath(basePath), port);
}

previewDocs(process.argv.slice(2));
