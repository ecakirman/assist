import { previewRuleAdder } from "./previewRuleActions/previewRuleAdder";
import { previewRuleCiter } from "./previewRuleActions/previewRuleCiter";

export function previewRuleActions(
	sessionId: string | undefined,
	sendInput: ((sessionId: string, data: string) => void) | undefined,
	quote: string | undefined,
	onSent: () => void,
) {
	return {
		onCite: previewRuleCiter(sessionId, sendInput, quote, onSent),
		onAddRule: previewRuleAdder(sessionId, sendInput, quote, onSent),
	};
}
