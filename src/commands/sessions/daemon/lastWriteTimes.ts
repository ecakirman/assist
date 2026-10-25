import { readFile } from "node:fs/promises";
import { writtenFilePaths } from "../shared/writtenFilePaths";

export type WriteTarget = { file: string; within: string };

type LastWrites = { file?: number; within?: number };

function normalise(path: string): string {
	return path.replaceAll("\\", "/");
}

function latest(current: number | undefined, at: number): number {
	return current === undefined || at > current ? at : current;
}

export async function lastWriteTimes(
	transcriptPath: string,
	target: WriteTarget,
): Promise<LastWrites> {
	const text = await readFile(transcriptPath, "utf8").catch(() => "");
	const result: LastWrites = {};
	for (const line of text.split("\n")) {
		if (!line.includes('"tool_use"')) continue;
		let entry: Record<string, unknown>;
		try {
			entry = JSON.parse(line);
		} catch {
			continue;
		}
		const at = Date.parse(String(entry.timestamp));
		if (Number.isNaN(at)) continue;
		for (const path of writtenFilePaths(entry).map(normalise)) {
			if (path.endsWith(`/${target.file}`))
				result.file = latest(result.file, at);
			if (path.includes(`/${target.within}`))
				result.within = latest(result.within, at);
		}
	}
	return result;
}
