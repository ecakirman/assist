import type { AssistClonesResult } from "./isAssistClonesMessage";
import { sendRuntimeMessage } from "./sendRuntimeMessage";

export function requestAssistClones(): Promise<AssistClonesResult> {
	return sendRuntimeMessage<AssistClonesResult>({ type: "assist-clones" });
}
