import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function listClones(baseDir: string): string[] {
	if (!existsSync(baseDir)) return [];
	return readdirSync(baseDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => join(baseDir, entry.name))
		.filter((dir) => existsSync(join(dir, ".git")))
		.sort();
}
