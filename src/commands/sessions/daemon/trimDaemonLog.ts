import {
	closeSync,
	fstatSync,
	ftruncateSync,
	openSync,
	readSync,
	writeSync,
} from "node:fs";
import { daemonPaths } from "./daemonPaths";

const MB = 1024 * 1024;

type TrimOptions = { path?: string; maxBytes?: number; keepBytes?: number };

export function trimDaemonLog({
	path = daemonPaths.log,
	maxBytes = 50 * MB,
	keepBytes = 25 * MB,
}: TrimOptions = {}): { before: number; after: number } | undefined {
	let fd: number;
	try {
		fd = openSync(path, "r+");
	} catch {
		return undefined;
	}
	try {
		const before = fstatSync(fd).size;
		if (before <= maxBytes) return undefined;
		const tail = Buffer.alloc(Math.min(keepBytes, before));
		readSync(fd, tail, 0, tail.length, before - tail.length);
		const kept = tail.subarray(tail.indexOf(0x0a) + 1);
		writeSync(fd, kept, 0, kept.length, 0);
		ftruncateSync(fd, kept.length);
		return { before, after: kept.length };
	} finally {
		closeSync(fd);
	}
}
