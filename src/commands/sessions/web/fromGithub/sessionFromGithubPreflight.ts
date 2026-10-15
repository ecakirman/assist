import type { IncomingMessage, ServerResponse } from "node:http";
import { allowExtensionOrigin } from "./allowExtensionOrigin";

export function sessionFromGithubPreflight(
	req: IncomingMessage,
	res: ServerResponse,
): void {
	allowExtensionOrigin(req, res);
	res.writeHead(204);
	res.end();
}
