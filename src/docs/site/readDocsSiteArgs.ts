import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { docsPaths } from "../docsPaths";

export function readDocsSiteArgs(argv: string[]) {
	const { values } = parseArgs({
		args: argv,
		options: {
			base: { type: "string", default: process.env.DOCS_BASE_PATH ?? "/" },
			out: { type: "string" },
			port: { type: "string", default: "4173" },
		},
	});
	return {
		basePath: values.base,
		outDir: values.out ? resolve(values.out) : docsPaths.outDir,
		port: Number(values.port),
	};
}
