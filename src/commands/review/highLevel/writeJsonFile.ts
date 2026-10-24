import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export function writeJsonFile(path: string, data: unknown): string {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
	return path;
}
