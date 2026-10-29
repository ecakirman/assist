import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { requestTab } from "./requestTab";
import { snapshotPath } from "./snapshotPath";

export async function browserSnapshot(options: {
	url?: string;
	server: string;
}): Promise<void> {
	const result = await requestTab(options.server, {
		op: "snapshot",
		url: options.url,
	});
	const path = snapshotPath(result.tabUrl, new Date());
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, result.html);
	console.log(`snapshot: ${path}`);
}
