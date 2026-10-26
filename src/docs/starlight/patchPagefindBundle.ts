import { readFileSync, writeFileSync } from "node:fs";
import { wrapPagefindSearch } from "./wrapPagefindSearch";

export function patchPagefindBundle(outDir: URL): void {
	const path = new URL("pagefind/pagefind.js", outDir);
	writeFileSync(path, wrapPagefindSearch(readFileSync(path, "utf8")));
}
