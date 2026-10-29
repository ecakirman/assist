import type { IncomingMessage, ServerResponse } from "node:http";
import { isExtensionOrigin } from "./isExtensionOrigin";

export function allowExtensionOrigin(
	req: IncomingMessage,
	res: ServerResponse,
): void {
	const origin = req.headers.origin;
	if (!origin || !isExtensionOrigin(origin)) return;
	res.setHeader("Access-Control-Allow-Origin", origin);
	res.setHeader("Access-Control-Allow-Methods", "POST");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.setHeader("Vary", "Origin");
}
