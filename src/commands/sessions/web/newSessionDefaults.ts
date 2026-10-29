import type { IncomingMessage, ServerResponse } from "node:http";
import { loadConfig } from "../../../shared/loadConfig";
import { loadConfigFrom } from "../../../shared/loadConfigFrom";
import { respondJson } from "../../../shared/web";

function modeFor(cwd: string) {
	const config = cwd ? loadConfigFrom(cwd) : loadConfig();
	return config.sessions?.newSessionMode ?? "draft";
}

export function newSessionDefaults(
	req: IncomingMessage,
	res: ServerResponse,
): void {
	const url = new URL(req.url ?? "/", "http://localhost");
	const cwds = url.searchParams.getAll("cwd");
	const modes = Object.fromEntries(cwds.map((cwd) => [cwd, modeFor(cwd)]));
	respondJson(res, 200, { modes });
}
