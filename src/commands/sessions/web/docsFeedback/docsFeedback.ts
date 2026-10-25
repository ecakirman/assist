import type { IncomingMessage, ServerResponse } from "node:http";
import { respondJson } from "../../../../shared/web";
import { requestDaemonReply } from "../../daemon/requestDaemonReply";
import { allowExtensionOrigin } from "../fromGithub/allowExtensionOrigin";
import { readJsonBody } from "../readJsonBody";
import { docsFeedbackPrompt } from "./docsFeedbackPrompt";
import { docsFeedbackSchema } from "./docsFeedbackSchema";

type TypePromptReply = { ok: boolean; message: string };

const DOCS_DIR = "docs/guide/";

export async function docsFeedback(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	allowExtensionOrigin(req, res);
	const parsed = docsFeedbackSchema.safeParse(
		await readJsonBody(req).catch(() => undefined),
	);
	if (!parsed.success) {
		respondJson(res, 400, { error: "Invalid docs feedback body" });
		return;
	}
	const reply = await requestDaemonReply<TypePromptReply>(
		{
			type: "type-prompt-to-writer",
			file: parsed.data.source,
			within: DOCS_DIR,
			text: docsFeedbackPrompt(parsed.data),
		},
		"type-prompt-result",
	);
	if (!reply) {
		respondJson(res, 504, { error: "assist daemon did not answer" });
		return;
	}
	if (!reply.ok) {
		respondJson(res, 404, { error: reply.message });
		return;
	}
	respondJson(res, 200, { message: reply.message });
}
