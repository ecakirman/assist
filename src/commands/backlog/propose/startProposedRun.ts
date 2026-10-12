import { startChainedSession } from "../../review/startChainedSession";
import { requestAssistSession } from "../../sessions/shared/requestAssistSession";
import { formatItemId } from "../formatItemId";

export function startProposedRun(id: number): Promise<void> {
	const itemId = formatItemId(id);
	return startChainedSession(`a backlog run session for ${itemId}`, () =>
		requestAssistSession(["backlog", "run", itemId], process.cwd()),
	);
}
