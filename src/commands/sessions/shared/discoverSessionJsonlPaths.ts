import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { SessionOrigin } from "./parseSessionFile";

type DiscoveredSessionPath = { path: string; origin: SessionOrigin };

export async function discoverSessionJsonlPaths(): Promise<
	DiscoveredSessionPath[]
> {
	const results: DiscoveredSessionPath[] = [];

	await Promise.all(
		sessionRoots().map(async ({ dir, origin }) => {
			let projectDirs: string[];
			try {
				projectDirs = await fs.promises.readdir(dir);
			} catch {
				return;
			}

			await Promise.all(
				projectDirs.map(async (dirName) => {
					const dirPath = path.join(dir, dirName);
					let entries: string[];
					try {
						entries = await fs.promises.readdir(dirPath);
					} catch {
						return;
					}

					for (const file of entries) {
						if (file.endsWith(".jsonl"))
							results.push({ path: path.join(dirPath, file), origin });
					}
				}),
			);
		}),
	);

	return results;
}

function sessionRoots(): { dir: string; origin: SessionOrigin }[] {
	return [
		{ dir: path.join(os.homedir(), ".claude", "projects"), origin: "wsl" },
	];
}
