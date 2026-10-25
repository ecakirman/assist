import { buildDocsSite } from "./site/buildDocsSite";
import { createLiveReload } from "./site/createLiveReload";
import { normalizeBasePath } from "./site/normalizeBasePath";
import { readDocsSiteArgs } from "./site/readDocsSiteArgs";
import { serveDocsSite } from "./site/serveDocsSite";
import { watchDocsSources } from "./site/watchDocsSources";

export function previewDocs(argv: string[]): void {
	const { basePath, outDir, port } = readDocsSiteArgs(argv);
	const sessionId = process.env.ASSIST_SESSION_ID;
	const build = () => buildDocsSite(basePath, outDir, { sessionId });
	try {
		build();
	} catch (error) {
		console.error((error as Error).message);
		process.exit(1);
	}
	console.log(
		sessionId
			? `Docs feedback from the assist extension goes to session ${sessionId}`
			: "Not started from an assist session; docs feedback has nowhere to go",
	);
	const liveReload = createLiveReload();
	watchDocsSources((change) => {
		try {
			build();
		} catch (error) {
			console.error((error as Error).message);
			return;
		}
		console.log(`Rebuilt docs (${change} change)`);
		liveReload.notify(change);
	});
	serveDocsSite(outDir, normalizeBasePath(basePath), port, liveReload);
}

previewDocs(process.argv.slice(2));
