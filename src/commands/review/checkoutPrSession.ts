import { randomUUID } from "node:crypto";
import { emitActivity } from "../../shared/emitActivity";
import { spawnClaude } from "../../shared/spawnClaude";
import { checkoutPr } from "./checkoutPr";

export async function checkoutPrSession(
	number: string,
	prompt = "",
): Promise<void> {
	await checkoutPr(number);
	const claudeSessionId = randomUUID();
	emitActivity({ kind: "command", name: "review", claudeSessionId });
	const { done } = spawnClaude(prompt, {
		permissionMode: "auto",
		sessionId: claudeSessionId,
	});
	await done;
}
