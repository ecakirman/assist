import type { IncomingMessage, ServerResponse } from "node:http";
import { basename } from "node:path";
import { expandTilde } from "../../../../shared/expandTilde";
import { loadConfig } from "../../../../shared/loadConfig";
import { respondJson } from "../../../../shared/web";
import { allowExtensionOrigin } from "./allowExtensionOrigin";
import { listClones } from "./listClones";

export function getClones(req: IncomingMessage, res: ServerResponse): void {
	allowExtensionOrigin(req, res);
	const baseDir = expandTilde(loadConfig().clone.baseDir);
	respondJson(res, 200, {
		clones: listClones(baseDir).map((dir) => basename(dir)),
	});
}
