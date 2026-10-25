import { sendTo } from "./broadcast";
import { daemonLog } from "./daemonLog";
import type { Handler } from "./routed";

export const handleTypePromptToWriter: Handler = (client, m, d) => {
	const target = { file: String(d.file), within: String(d.within) };
	daemonLog(`type-prompt-to-writer received: file=${target.file}`);
	m.io.typePromptToLastWriter(target, String(d.text ?? "")).then((reply) => {
		if (!reply.ok) daemonLog(`type-prompt-to-writer refused: ${reply.message}`);
		sendTo(client, { type: "type-prompt-result", ...reply });
	});
};
