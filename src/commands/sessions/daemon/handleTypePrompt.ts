import { sendTo } from "./broadcast";
import { daemonLog } from "./daemonLog";
import type { Handler } from "./routed";

export const handleTypePrompt: Handler = (client, m, d) => {
	const reply = m.io.typePrompt(String(d.sessionId), String(d.text ?? ""));
	if (!reply.ok) daemonLog(`type-prompt refused: ${reply.message}`);
	sendTo(client, { type: "type-prompt-result", ...reply });
};
