import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { getCurrentOrigin } from "../../../backlog/getCurrentOrigin";

export function findCloneByOrigin(
	origin: string,
	baseDir: string,
): string | undefined {
	if (!existsSync(baseDir)) return undefined;
	return readdirSync(baseDir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => join(baseDir, entry.name))
		.filter((dir) => existsSync(join(dir, ".git")))
		.sort()
		.find((dir) => getCurrentOrigin(dir) === origin);
}
