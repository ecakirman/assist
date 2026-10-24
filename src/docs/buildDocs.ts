import { buildDocsSite } from "./site/buildDocsSite";
import { readDocsSiteArgs } from "./site/readDocsSiteArgs";

export function buildDocs(argv: string[]): void {
	const { basePath, outDir } = readDocsSiteArgs(argv);
	try {
		const count = buildDocsSite(basePath, outDir);
		console.log(`Built ${count} docs pages into ${outDir} (base ${basePath})`);
		process.exit(0);
	} catch (error) {
		console.error((error as Error).message);
		process.exit(1);
	}
}

buildDocs(process.argv.slice(2));
