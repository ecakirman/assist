import type { IncomingMessage, ServerResponse } from "node:http";
import { respondJson } from "../../../../shared/web";
import { recordPromptJournal } from "../../daemon/recordPromptJournal";
import { requestDaemonReply } from "../../daemon/requestDaemonReply";
import { allowExtensionOrigin } from "../fromGithub/allowExtensionOrigin";
import { readJsonBody } from "../readJsonBody";
import { docsFeedbackPrompt } from "./docsFeedbackPrompt";
import { docsFeedbackSchema } from "./docsFeedbackSchema";

type TypePromptReply = { ok: boolean; message: string };

const DOCS_DIR = "docs/src/";

function respond(
	res: ServerResponse,
	text: string,
	status: number,
	message: string,
): void {
	recordPromptJournal({
		event: "outcome",
		text,
		message: `${status} ${message}`,
	});
	respondJson(res, status, status === 200 ? { message } : { error: message });
}

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
	const text = docsFeedbackPrompt(parsed.data);
	recordPromptJournal({ event: "received", text });
	const reply = await requestDaemonReply<TypePromptReply>(
		{
			type: "type-prompt-to-writer",
			file: parsed.data.source,
			within: DOCS_DIR,
			text,
		},
		"type-prompt-result",
	);
	if (!reply) respond(res, text, 504, "assist daemon did not answer");
	else respond(res, text, reply.ok ? 200 : 404, reply.message);
}
