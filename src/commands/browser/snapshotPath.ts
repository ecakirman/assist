import { homedir } from "node:os";
import { join } from "node:path";

export function snapshotPath(tabUrl: string, now: Date): string {
	const host = new URL(tabUrl).host.replace(/[^\w.-]/g, "-");
	const timestamp = now.toISOString().replace(/[:.]/g, "-");
	return join(homedir(), ".assist", "browser", `${host}-${timestamp}.html`);
}
