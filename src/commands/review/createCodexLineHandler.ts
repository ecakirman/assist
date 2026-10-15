import type { SpinnerHandle } from "./MultiSpinner";
import { parseCodexEvent } from "./parseCodexEvent";
import { reportReviewerToolUse } from "./reportReviewerToolUse";
import type { TokenUsage } from "./TokenUsage";

type CodexStreamState = { usage?: TokenUsage };

function addUsage(total: TokenUsage | undefined, turn: TokenUsage): TokenUsage {
	if (!total) return turn;
	return {
		input: total.input + turn.input,
		output: total.output + turn.output,
		cacheRead: total.cacheRead + turn.cacheRead,
	};
}

export function createCodexLineHandler(
	name: string,
	spinner: SpinnerHandle | undefined,
	model: string | undefined,
): { state: CodexStreamState; onLine: (line: string) => void } {
	const state: CodexStreamState = {};
	const onLine = (line: string) => {
		const event = parseCodexEvent(line);
		if (event.kind === "tool_use")
			reportReviewerToolUse(name, event, spinner, model);
		else if (event.kind === "usage")
			state.usage = addUsage(state.usage, event.usage);
	};
	return { state, onLine };
}
