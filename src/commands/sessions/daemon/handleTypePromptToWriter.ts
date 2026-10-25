import { sendTo } from "./broadcast";
import { daemonLog } from "./daemonLog";
import type { Handler } from "./routed";

export const handleTypePromptToWriter: Handler = (client, m, d) => {
	const target = { file: String(d.file), within: String(d.within) };
	daemonLog(`type-prompt-to-writer received: file=${target.file}`);
	m.io.typePromptToLastWriter(target, String(d.text ?? "")).then((result) => {
		if (typeof result !== "string")
			daemonLog(`type-prompt-to-writer refused: ${result.refused}`);
		sendTo(client, {
			type: "type-prompt-result",
			ok: typeof result === "string",
			message:
				typeof result === "string"
					? `Sent to assist session ${result}, the last to write ${target.file}`
					: result.refused,
		});
	});
};
