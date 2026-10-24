import { buildDocsSite } from "./site/buildDocsSite";
import { normalizeBasePath } from "./site/normalizeBasePath";
import { readDocsSiteArgs } from "./site/readDocsSiteArgs";
import { serveDocsSite } from "./site/serveDocsSite";

export function previewDocs(argv: string[]): void {
	const { basePath, outDir, port } = readDocsSiteArgs(argv);
	const sessionId = process.env.ASSIST_SESSION_ID;
	try {
		buildDocsSite(basePath, outDir, { sessionId });
	} catch (error) {
		console.error((error as Error).message);
		process.exit(1);
	}
	console.log(
		sessionId
			? `Docs feedback from the assist extension goes to session ${sessionId}`
			: "Not started from an assist session; docs feedback has nowhere to go",
	);
	serveDocsSite(outDir, normalizeBasePath(basePath), port);
}

previewDocs(process.argv.slice(2));
