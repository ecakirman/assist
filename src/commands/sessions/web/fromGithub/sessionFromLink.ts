import type { IncomingMessage, ServerResponse } from "node:http";
import { launchFromGithub } from "./launchFromGithub";
import { launchPlannedSession } from "./launchPlannedSession";
import { planLinkSession } from "./planLinkSession";

export function sessionFromLink(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	return launchFromGithub(req, res, planLinkSession, launchPlannedSession);
}
