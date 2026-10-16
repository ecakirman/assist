import {
	existsSync,
	mkdirSync,
	readFileSync,
	renameSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function getStoreDir(): string {
	return process.env.ASSIST_STORE_DIR || join(homedir(), ".assist");
}

function getStorePath(filename: string): string {
	return join(getStoreDir(), filename);
}

export function loadJson<T extends object>(filename: string): T {
	const path = getStorePath(filename);
	if (existsSync(path)) {
		try {
			return JSON.parse(readFileSync(path, "utf8"));
		} catch {
			return {} as T;
		}
	}
	return {} as T;
}

export function saveJson<T extends object>(filename: string, data: T): void {
	const dir = getStoreDir();
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
	const path = getStorePath(filename);
	// why: write-then-rename so a failed write (e.g. disk full) never truncates the existing file.
	const tmp = `${path}.${process.pid}.tmp`;
	try {
		writeFileSync(tmp, JSON.stringify(data, null, 2));
		renameSync(tmp, path);
	} catch (error) {
		rmSync(tmp, { force: true });
		throw error;
	}
}
