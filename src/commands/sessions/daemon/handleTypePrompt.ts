import { sendTo } from "./broadcast";
import { daemonLog } from "./daemonLog";
import type { Handler } from "./routed";

export const handleTypePrompt: Handler = (client, m, d) => {
	const sessionId = String(d.sessionId);
	const refused = m.io.typePrompt(sessionId, String(d.text ?? ""));
	if (refused) daemonLog(`type-prompt refused: ${refused}`);
	sendTo(client, {
		type: "type-prompt-result",
		ok: !refused,
		message: refused ?? `Sent to assist session ${sessionId}`,
	});
};
