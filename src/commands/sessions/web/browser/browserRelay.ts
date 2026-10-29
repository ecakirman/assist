import type { IncomingMessage, ServerResponse } from "node:http";
import { respondJson } from "../../../../shared/web";
import type { BrowserRequest } from "../../../extension/browserLink/types";
import { readJsonBody } from "../readJsonBody";
import { browserLink } from "./browserLink";

const RELAY_TIMEOUT_MS = 10_000;

function parseBrowserRequest(body: unknown): BrowserRequest | undefined {
	const { op, url } = (body ?? {}) as Record<string, unknown>;
	if (op !== "status") return undefined;
	if (url !== undefined && typeof url !== "string") return undefined;
	return { op, url };
}

export async function browserRelay(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	if (req.headers.origin) {
		respondJson(res, 403, { error: "browser relay is CLI-only" });
		return;
	}
	const request = parseBrowserRequest(
		await readJsonBody(req).catch(() => undefined),
	);
	if (!request) {
		respondJson(res, 400, { error: "Invalid browser request" });
		return;
	}
	try {
		respondJson(res, 200, await browserLink.request(request, RELAY_TIMEOUT_MS));
	} catch (error) {
		const status = (error as { status?: number }).status ?? 500;
		respondJson(res, status, {
			error: error instanceof Error ? error.message : String(error),
		});
	}
}
